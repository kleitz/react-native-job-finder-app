//
//  RCTSubscriberViewManager.m
//  sealJobs
//
//  Created by Bogdan Onu on 08.12.2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTSubscriberViewManager.h"

#import <React/RCTUtils.h>
#import "RCTOpenTok.h"
#import "StreamView.h"

//  ===================== RCTSubscriber =====================
// see https://support.tokbox.com/hc/en-us/community/posts/210709166-Random-crash-when-completing-the-video-session-iOS-OpenTok-2-8-3-

@interface RCTSubscriber : OTSubscriber
@end

@implementation RCTSubscriber
{
  //  Keep week reference to delegate to fix crash on OpenTok component
  __weak id<OTSubscriberDelegate> _weakDelegate;
}

-(void)setDelegate:(id<OTSubscriberKitDelegate>)delegate
{
  _weakDelegate = (id)delegate;
  
  [super setDelegate:delegate];
}

-(id<OTSubscriberKitDelegate>)delegate
{
  //  Return the weak delegate reference to fix crash on OpenTok component
  return _weakDelegate;
}

@end

//  ===================== RCTSubscriberView =====================

@interface RCTSubscriberView : StreamView <OTSubscriberDelegate>

@property(strong, nonatomic) OTSubscriber* subscriber;

@property(copy, nonatomic) RCTDirectEventBlock onVideoStarted;
@property(copy, nonatomic) RCTDirectEventBlock onVideoStopped;

@property(copy, nonatomic) RCTDirectEventBlock onShowWarning;
@property(copy, nonatomic) RCTDirectEventBlock onStopWarning;


-(void)startStreaming:(OTStream*)stream;

@end

@implementation RCTSubscriberView

-(void)dealloc
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
  
  [self stopStreaming];
}

-(void)setScaleMode:(OTVideoViewScaleBehavior)scaleMode
{
  [super setScaleMode:scaleMode];
  
  self.subscriber.viewScaleBehavior = scaleMode;
}

-(void)setActiveAudio:(BOOL)activeAudio
{
  [super setActiveAudio:activeAudio];
  
  self.subscriber.subscribeToAudio = activeAudio;
}

-(void)setActiveVideo:(BOOL)activeVideo
{
  [super setActiveVideo:activeVideo];
  
  self.subscriber.subscribeToVideo = activeVideo;
}

-(void)stopStreaming
{
  if (self.subscriber)
  {
    NSLog(@"%s",__PRETTY_FUNCTION__);

    [self.subscriber.view removeFromSuperview];
    [self.subscriber.session unsubscribe:self.subscriber error:nil];
    
    self.subscriber.delegate = nil;
    self.subscriber = nil;
  }
}

-(void)startStreaming:(OTStream*)stream
{
  [self stopStreaming];
  
  if (stream == nil) {
    return;
  }
  
  NSLog(@"%s",__PRETTY_FUNCTION__);

  OTSubscriber *subscriber= [[RCTSubscriber alloc] initWithStream:stream delegate:nil];
  subscriber.subscribeToAudio = self.activeAudio;
  subscriber.subscribeToVideo = self.activeVideo;
  
  NSError *streamError = nil;
  [stream.session subscribe:subscriber error:&streamError];
  
  if(streamError){
    NSLog(@"streamError: %@",streamError);
    
    if(self.onFail) {
      self.onFail(@{@"error" : RCTJSErrorFromNSError(streamError)});
    }
  }else {
    [self startStreamingToSession:stream.session usingSubscriber:subscriber];
  }
}

-(void)startStreamingToSession:(OTSession*)session usingSubscriber:(OTSubscriber *)subscriber
{
  self.subscriber = subscriber;
  self.subscriber.delegate = self;
  self.subscriber.viewScaleBehavior = self.scaleMode;
  
  [self addRenderChildView:self.subscriber.view];
}

-(void)subscriber:(OTSubscriberKit *)subscriber didFailWithError:(OTError *)error
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
  NSLog(@"error: %@",error);
  
  if(self.onFail){
    id body = @{
                @"sessionId" : subscriber.session.sessionId,
                @"streamId" : subscriber.stream.streamId,
                @"connectionId" : subscriber.stream.connection.connectionId,
                @"error" : RCTJSErrorFromNSError(error)
                };
    self.onFail(body);
  }
}

-(void)subscriberDidConnectToStream:(OTSubscriberKit *)subscriber
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
  if(self.onConnect){
    self.onConnect(@{
                     @"sessionId" : subscriber.session.sessionId,
                     @"streamId" : subscriber.stream.streamId,
                     @"connectionId" : subscriber.stream.connection.connectionId
                     });
  }
}

-(void)subscriberDidDisconnectFromStream:(OTSubscriberKit *)subscriber
{
  NSLog(@"%s",__PRETTY_FUNCTION__);

  if(self.onDisconnect){
    self.onDisconnect(@{
                        @"sessionId" : subscriber.session.sessionId,
                        @"streamId" : subscriber.stream.streamId,
                        @"connectionId" : subscriber.stream.connection.connectionId
                        });
  }
}

-(void)subscriberVideoDataReceived:(OTSubscriber *)subscriber
{
  //  NSLog(@"%s",__PRETTY_FUNCTION__);
  //
}

-(void)subscriberVideoEnabled:(OTSubscriberKit *)subscriber reason:(OTSubscriberVideoEventReason)reason
{
   NSLog(@"%s",__PRETTY_FUNCTION__);
  
  if (self.onVideoStarted) {
    self.onVideoStarted(@{
        @"reason" : @(reason)
    });
  }
}

-(void)subscriberVideoDisabled:(OTSubscriberKit *)subscriber reason:(OTSubscriberVideoEventReason)reason
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
  
  if (self.onVideoStopped) {
    self.onVideoStopped(@{
      @"reason" : @(reason)
   });
  }
}


-(void)subscriberVideoDisableWarning:(OTSubscriberKit *)subscriber
{
   NSLog(@"%s",__PRETTY_FUNCTION__);
  
  if (self.onShowWarning) {
    self.onShowWarning(nil);
  }
}

-(void)subscriberVideoDisableWarningLifted:(OTSubscriberKit *)subscriber
{
   NSLog(@"%s",__PRETTY_FUNCTION__);
  
  if (self.onStopWarning) {
    self.onStopWarning(nil);
  }
}

@end

@implementation RCTSubscriberViewManager

RCT_EXPORT_MODULE(SubscriberView)

-(UIView *)view
{
  return [RCTSubscriberView new];
}

RCT_EXPORT_VIEW_PROPERTY(onConnect, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDisconnect, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFail, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onVideoStarted, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoStopped, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onShowWarning, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStopWarning, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(activeAudio, BOOL)
RCT_EXPORT_VIEW_PROPERTY(activeVideo, BOOL)

RCT_EXPORT_VIEW_PROPERTY(scaleMode, OTVideoViewScaleBehavior)

RCT_CUSTOM_VIEW_PROPERTY(streamId, NSString, RCTSubscriberView)
{
  NSString * streamID = json;
  
  OTSession *activeSession = [RCTOpenTok activeSession];
  
  OTStream *stream = [[activeSession streams] objectForKey:streamID];
  
  [view startStreaming:stream];
}

@end
