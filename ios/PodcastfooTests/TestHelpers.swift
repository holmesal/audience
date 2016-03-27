//
//  TestHelpers.swift
//  Podcastfoo
//
//  Created by Ethan Sherr on 3/27/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation
import XCTest

extension XCTestCase
{
  func expectationForCondition(condition: Void -> Bool)
  {
    expectationForPredicate(
      NSPredicate(block:
        {
          (_, _) in
          return condition()
        }),
      evaluatedWithObject: self, handler: nil)
  }
  
  func waitForExpectationsWithTimeout(timeout: NSTimeInterval)
  {
    waitForExpectationsWithTimeout(timeout, handler: nil)
  }

  func sleep(timeInterval: NSTimeInterval)
  {
    let start = NSDate()
    expectationForCondition
    {
      let dt = NSDate().timeIntervalSinceDate(start)
      return timeInterval < dt
    }
    waitForExpectationsWithTimeout(timeInterval + 5, handler: nil)
  }
}