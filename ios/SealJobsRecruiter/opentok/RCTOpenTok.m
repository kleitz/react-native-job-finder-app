
#import "RCTOpenTok.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#import <OpenTok/OpenTok.h>

static NSString *OnSignalReceived = @"OT-onSignalReceived";

static NSString *OnSessionConnect = @"OT-onSessionConnect";
static NSString *OnSessionDisconnect = @"OT-onSessionDisconnect";

static NSString *OnSessionWillReconnect = @"OT-onSessionWillReconnect";
static NSString *OnSessionDidReconnect = @"OT-onSessionDidReconnect";

static NSString *OnSessionError = @"OT-onSessionError";

static NSString *OnStreamStarted = @"OT-onStreamStarted";
static NSString *OnStreamEnded = @"OT-onStreamEnded";


@interface RCTOpenTok ()
@end

__weak static OTSession *_activeSession;

@implementation RCTOpenTok
{
  OTSession *_session;
}

+(OTSession *)activeSession
{
  return  _activeSession;
}

-(void)dealloc
{
  _activeSession.delegate = nil;
  _activeSession = nil;
}

-(instancetype)init
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  return [super init];
}

RCT_EXPORT_MODULE(OpenTokIOS);

-(NSArray<NSString *> *)supportedEvents
{
  return @[
           OnSessionConnect,
           OnSessionDisconnect,
           OnSessionWillReconnect,
           OnSessionDidReconnect,
           OnSignalReceived,
           OnStreamStarted,
           OnStreamEnded,
           OnSessionError,
           ];
}

-(NSDictionary<NSString *,id> *)constantsToExport
{
  return @{
           @"onSessionConnect" : OnSessionConnect,
           @"onSessionDisconnect": OnSessionDisconnect,
           @"onSessionWillReconnect" : OnSessionWillReconnect,
           @"onSessionDidReconnect" : OnSessionDidReconnect,
           @"onMessageReceived" : OnSignalReceived,
           @"onStreamStarted": OnStreamStarted,
           @"onStreamEnded": OnStreamEnded,
           @"onSessionError": OnSessionError,
           };
}

RCT_EXPORT_METHOD(connect:(NSString *)apiKey
                  sessionId:(NSString *)sessionId
                  token:(NSString *)token
                  errorCallback:(RCTResponseErrorBlock)failCallback)
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  _session.delegate = nil;

  _session = [[OTSession alloc] initWithApiKey:apiKey sessionId:sessionId delegate:self];
  _activeSession = _session;

  OTError *error = nil;
  [_session connectWithToken:token error:&error];

  if (error) {
    NSLog(@"connect failed with error: (%@)", error);
    failCallback(error);
  }
}

RCT_EXPORT_METHOD(disconnect:(RCTResponseErrorBlock)failCallback)
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  OTError *error = nil;

  [_session disconnect:&error];

  if (error) {
    NSLog(@"disconnect failed with error: (%@)", error);
    failCallback(error);
  }else{
    _session.delegate = nil;
    _session = nil;
    _activeSession = nil;
  }
}

-(void)clearSession
{
  _session.delegate = nil;
  [_session disconnect:nil];
  _session = nil;
}

RCT_EXPORT_METHOD(sendMessage:(NSString *)signalType message:(NSString*)message callback:(RCTResponseErrorBlock)failCallback)
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  OTError* error = nil;
  [_session signalWithType:signalType string:message connection:nil error:&error];
  if (error) {
    NSLog(@"signal error %@", error);
    failCallback(error);
  } else {
    NSLog(@"signal sent");
  }
}

# pragma mark - OTSession delegate callbacks

-(void)startObserving
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
}

-(void)stopObserving
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
}

- (void)sessionDidConnect:(OTSession*)session
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  id body = @{
              @"sessionId" : session.sessionId,
              @"connectionId": session.connection.connectionId
              };

  [self sendEventWithName:OnSessionConnect body:body];
}

- (void)sessionDidDisconnect:(OTSession *)session
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  id body = @{
              @"sessionId" : session.sessionId
              };

  [self sendEventWithName:OnSessionDisconnect body:body];
}

- (void)sessionDidBeginReconnecting:(OTSession*)session
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  id body = @{
              @"sessionId" : session.sessionId
              };

  [self sendEventWithName:OnSessionWillReconnect body:body];
}

-(void)sessionDidReconnect:(OTSession *)session
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  id body = @{
              @"sessionId" : session.sessionId
              };

  [self sendEventWithName:OnSessionDidReconnect body:body];
}

- (void)session:(OTSession*)session didFailWithError:(OTError*)error
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  NSLog(@"error: %@",error);

  id body = @{
              @"sessionId" : session.sessionId,
              @"error" : RCTJSErrorFromNSError(error),
              };

  [self sendEventWithName:OnSessionError body:body];
}

- (void)session:(OTSession*)session streamCreated:(OTStream *)stream
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  id body = @{
    @"streamId": stream.streamId,
    @"sessionId": session.sessionId,
    @"connectionId": stream.connection.connectionId,
  };

  [self sendEventWithName:OnStreamStarted body:body];
}

- (void)session:(OTSession*)session streamDestroyed:(OTStream *)stream
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  id body = @{
              @"streamId": stream.streamId,
              @"sessionId": session.sessionId,
              @"connectionId": stream.connection.connectionId,
              };

  [self sendEventWithName:OnStreamEnded body:body];
}

- (void)session:(OTSession*)session receivedSignalType:(NSString*)type fromConnection:(OTConnection*)connection withString:(NSString*)string
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
  NSLog(@"%@ -> %@", type, string);

  id body = @{
              @"type" : type,
              @"message" : string,
              @"connectionId": connection.connectionId,
              @"sessionId": session.sessionId,
              @"data": connection.data ?: [NSNull null]
              };

  [self sendEventWithName:OnSignalReceived body:body];
}


@end
