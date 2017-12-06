//
//  StreamView.m
//  sealJobs
//
//  Created by Bogdan Onu on 09.12.2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "StreamView.h"
#import <React/RCTConvert.h>

@implementation StreamView

-(instancetype)init
{
  self = [super init];
  
  _activeAudio = YES;
  _activeVideo = YES;
  
  return self;
}

-(void)addRenderChildView:(UIView*)renderView
{
  renderView.frame = self.bounds;
  renderView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  renderView.translatesAutoresizingMaskIntoConstraints = YES;
  
  [self insertSubview:renderView atIndex:0];
}

@end

@implementation RCTConvert (ScaleMode)

RCT_ENUM_CONVERTER(OTVideoViewScaleBehavior,
                   (@{ @"fill": @(OTVideoViewScaleBehaviorFill),
                       @"fit": @(OTVideoViewScaleBehaviorFit) }),
                   OTVideoViewScaleBehaviorFill, integerValue)

@end
