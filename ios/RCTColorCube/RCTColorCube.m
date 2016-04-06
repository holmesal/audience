//
//  ColorCube.m
//  Podcastfoo
//
//  Created by Alonso Holmes on 4/5/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTColorCube.h"
#import "RCTLog.h"
#import "RCTConvert.h"
#import "CCColorCube.h"
//#import "RCTImageDownloader.h"

@interface RCTColorCube()

@property (strong, nonatomic) CCColorCube *colorCube;

@end

@implementation RCTColorCube

- (instancetype)init
{
  self = [super init];
  if (self) {
    _colorCube = [[CCColorCube alloc] init];
  }
  return self;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getColors:(NSString *)imageURL callback:(RCTResponseSenderBlock)callback)
{
  NSLog(@"getting colors for image with imageURL: %@", imageURL);
//  UIImage *_image = [RCTConvert UIImage:image];
//  if (!_image) {
//    // Download the image
//    NSLog(@"this image does not exist!");
//  }
  dispatch_async(dispatch_get_global_queue(0,0), ^{
    NSData * data = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: imageURL]];
    if ( data == nil )
      return;
    UIImage *img = [UIImage imageWithData:data];
    NSLog(@"%@", img);
//    CCColorCube *colorCube = [[CCColorCube alloc] init];
    NSArray *imgColors = [_colorCube extractColorsFromImage:img flags:
                          CCAvoidBlack |
                          CCAvoidWhite |
                          CCOnlyDistinctColors
                          ];
    NSLog(@"%@", imgColors);
    NSLog(@"done!");
    NSMutableArray *newArray = [NSMutableArray array];
    [imgColors enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
      const CGFloat* components = CGColorGetComponents([imgColors[idx] CGColor]);
      NSString *rgb = [NSString stringWithFormat:@"%f,%f,%f", components[0], components[1], components[2]];
      [newArray addObject:rgb];
    }];
    callback(@[[NSNull null], newArray]);
//    dispatch_async(dispatch_get_main_queue(), ^{
//      // WARNING: is the cell still using the same data by this point??
//      cell.image = [UIImage imageWithData: data];
//    });
  });
}

@end
