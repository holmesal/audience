//
//  threadHelper.swift
//  Podcastfoo
//
//  Created by Alonso Holmes on 3/21/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

func runOnMain(task:Void -> Void) {
  dispatch_async(dispatch_get_main_queue(), task);
}