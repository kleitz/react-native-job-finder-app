//
//  StreamView.h
//  sealJobs
//
//  Created by Bogdan Onu on 09.12.2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <OpenTok/OpenTok.h>

#import <React/RCTComponent.h>

@interface StreamView : UIView

@property(assign, nonatomic) BOOL activeAudio;
@property(assign, nonatomic) BOOL activeVideo;

@property(assign, nonatomic) OTVideoViewScaleBehavior scaleMode;

@property(copy, nonatomic) RCTDirectEventBlock onConnect;
@property(copy, nonatomic) RCTDirectEventBlock onDisconnect;

@property(copy, nonatomic) RCTDirectEventBlock onFail;

-(void)addRenderChildView:(UIView*)renderView;

@end
