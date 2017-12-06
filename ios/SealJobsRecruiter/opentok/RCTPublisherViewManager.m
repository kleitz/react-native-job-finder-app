//
//  RCTPublisherViewManager.m
//  sealJobs
//
//  Created by Bogdan Onu on 07.12.2016.
//  Copyright © 2016 Facebook. All rights reserved.
//



#import "StreamView.h"
#import "RCTPublisherViewManager.h"

#import <React/RCTUtils.h>
#import "RCTOpenTok.h"

@interface RCTPublisherView : StreamView <OTPublisherDelegate>

@property(nonatomic) AVCaptureDevicePosition cameraPosition;

@property(strong, nonatomic, readonly) OTPublisher* publisher;

-(void)startStreamingOnSession:(OTSession*)session;

@end

@implementation RCTPublisherView

-(void)dealloc
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
  
  [self stopStreaming];
}

-(void)setScaleMode:(OTVideoViewScaleBehavior)scaleMode
{
  [super setScaleMode:scaleMode];
  
  self.publisher.viewScaleBehavior = scaleMode;
}

-(void)setCameraPosition:(AVCaptureDevicePosition)cameraPosition
{
  _cameraPosition = cameraPosition;
  
  self.publisher.cameraPosition = cameraPosition;
}

-(void)setActiveAudio:(BOOL)activeAudio
{
  [super setActiveAudio:activeAudio];
  
  self.publisher.publishAudio = activeAudio;
}

-(void)setActiveVideo:(BOOL)activeVideo
{
  [super setActiveVideo:activeVideo];
  
  self.publisher.publishVideo = activeVideo;
}

-(void)stopStreaming
{
  if(_publisher == nil) { return; }
  
  NSLog(@"%s",__PRETTY_FUNCTION__);
  
  [_publisher.session unpublish:_publisher error:nil];

  [_publisher.view removeFromSuperview];
  _publisher.delegate = nil;
  _publisher = nil;
}

-(void)startStreamingOnSession:(OTSession*)session
{
  [self stopStreaming];
  
  NSLog(@"%s",__PRETTY_FUNCTION__);

  OTPublisher *publisher = [[OTPublisher alloc] initWithDelegate:nil];
  publisher.cameraPosition = self.cameraPosition;
  publisher.publishAudio = self.activeAudio;
  publisher.publishVideo = self.activeVideo;
  
  NSError *streamError = nil;

  [session publish:publisher error:&streamError];
  
  if(streamError){
    NSLog(@"streamError: %@",streamError);
    
    if(self.onFail) {
      self.onFail(@{@"error" : RCTJSErrorFromNSError(streamError)});
    }
  }else {
    [self startStreamingPublisher:publisher];
  }
}

-(void)startStreamingPublisher:(OTPublisher *)publisher
{
  _publisher = publisher;
  _publisher.delegate = self;
  
  [self addRenderChildView:self.publisher.view];
}

- (void)publisher:(OTPublisherKit*)publisher didFailWithError:(OTError*)error
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
  NSLog(@"error: %@",error);
  
  if(self.onFail){
    id body = @{
                @"sessionId" : publisher.session.sessionId,
                @"streamId" : publisher.stream.streamId,
                @"connectionId" : publisher.stream.connection.connectionId,
                @"error" : RCTJSErrorFromNSError(error)
                };
    self.onFail(body);
  }
}

- (void)publisher:(OTPublisherKit*)publisher streamCreated:(OTStream*)stream
{
  NSLog(@"%s",__PRETTY_FUNCTION__);
  if(self.onConnect){
    self.onConnect(@{
                     @"sessionId" : publisher.session.sessionId,
                     @"streamId" : publisher.stream.streamId,
                     @"connectionId" : publisher.stream.connection.connectionId
                     });
  }
}

- (void)publisher:(OTPublisherKit*)publisher streamDestroyed:(OTStream*)stream
{
  if(self.onDisconnect){
    self.onDisconnect(@{
                        @"sessionId" : publisher.session.sessionId,
                        @"streamId" : publisher.stream.streamId,
                        @"connectionId" : publisher.stream.connection.connectionId
                        });
  }
}

@end

@implementation RCTPublisherViewManager

RCT_EXPORT_MODULE(PublisherView)

-(UIView *)view
{
  return [RCTPublisherView new];
}

RCT_EXPORT_VIEW_PROPERTY(onConnect, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDisconnect, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFail, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(cameraPosition, AVCaptureDevicePosition)

RCT_EXPORT_VIEW_PROPERTY(scaleMode, OTVideoViewScaleBehavior)

RCT_EXPORT_VIEW_PROPERTY(activeAudio, BOOL)
RCT_EXPORT_VIEW_PROPERTY(activeVideo, BOOL)

RCT_CUSTOM_VIEW_PROPERTY(active, BOOL, RCTPublisherView)
{
  BOOL activate = [json boolValue];
  
  if (activate == NO){
    return [view stopStreaming];
  }
  
  OTSession *activeSession = [RCTOpenTok activeSession];
  
  if (activeSession == nil) { return; }
  
  [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
    if(granted){
      // Access to the camera is granted. You can publish.
      dispatch_async(dispatch_get_main_queue(), ^{
        [view startStreamingOnSession:activeSession];
      });
    } else {
      // Access to the camera is not granted.
      if(view.onFail){
        id noAccessError =  RCTMakeError(@"RCT Error no camera permissions", nil, nil);
        view.onFail(noAccessError);
      }
    }
  }];
  
}

@end

@implementation RCTConvert (CameraPosition)

RCT_ENUM_CONVERTER(AVCaptureDevicePosition,
                   (@{ @"front": @(AVCaptureDevicePositionFront),
                       @"back": @(AVCaptureDevicePositionBack) }),
                   AVCaptureDevicePositionUnspecified, integerValue)

@end
