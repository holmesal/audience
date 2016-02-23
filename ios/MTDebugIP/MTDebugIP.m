//
//  MTDebugIP.m
//  Audience
//
//  Created by Alonso Holmes on 2/22/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "MTDebugIP.h"

@implementation MTDebugIP

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  return @{ @"debugIP": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"SERVER_IP"] };
}

RCT_EXPORT_METHOD(getDebugIP:(RCTResponseSenderBlock)callback)
{
  NSString *serverIP = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"SERVER_IP"];
  callback(@[[NSNull null], serverIP]);
}

@end
