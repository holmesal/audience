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
  NSString *serverIP = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"SERVER_IP"];
  if (!serverIP) serverIP = @"";
  return @{ @"debugIP": serverIP };
}

RCT_EXPORT_METHOD(getDebugIP:(RCTResponseSenderBlock)callback)
{
  NSString *serverIP = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"SERVER_IP"];
  if (!serverIP) serverIP = @"";
  callback(@[[NSNull null], serverIP]);
}

@end
