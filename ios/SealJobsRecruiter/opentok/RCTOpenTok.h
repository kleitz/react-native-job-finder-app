//  SomeString.h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <OpenTok/OpenTok.h>


@interface RCTOpenTok : RCTEventEmitter <OTSessionDelegate>

+(OTSession*)activeSession;

@end
