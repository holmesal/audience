//
//  PFAudio.m
//  Podcastfoo
//
//  Created by Alonso Holmes on 3/21/16.
//  Copyright © 2016 Facebook. All rights reserved.
//



//#import <FreeStreamer/FreeStreamer.h>
//
@implementation PFAudio

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getDebugIP:(RCTResponseSenderBlock)callback)
{
  NSString *serverIP = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"SERVER_IP"];
  if (!serverIP) serverIP = @"";
  callback(@[[NSNull null], serverIP]);
}

@end
