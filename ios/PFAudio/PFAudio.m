//
//  MTAudioBridge.m
//  podcastfooMobile
//
//  Created by Alonso Holmes on 9/26/15.
//

#import "RCTBridge.h"
#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(PFAudio, NSObject)

RCT_EXTERN_METHOD(setSource:(NSString *)sourceUrl);
RCT_EXTERN_METHOD(play:(NSString *)source podcastTitle:(NSString *)podcastTitle episodeTitle:(NSString *)episodeTitle artworkUrl:(NSString *)artworkUrl);
RCT_EXTERN_METHOD(pause);
RCT_EXTERN_METHOD(resume);
RCT_EXTERN_METHOD(seekToTime:(nonnull NSNumber *)timestamp);
RCT_EXTERN_METHOD(startRecording);
RCT_EXTERN_METHOD(stopRecording:(RCTResponseSenderBlock)callback);

@end
