//
//  PFAudio.h
//  Podcastfoo
//
//  Created by Alonso Holmes on 3/21/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"
#import <FreeStreamer/FreeStreamer.h>

@class FSAudioStream;

@interface PFAudio : NSObject <RCTBridgeModule>
  FSAudioStream *_audioStream;
@end