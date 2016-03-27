//
//  PFAudioRecordTests.swift
//  Podcastfoo
//
//  Created by Ethan Sherr on 3/27/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import XCTest
@testable import Podcastfoo

class PFAudioRecordTests: XCTestCase {


  func setupForRecordingTest() -> PFAudio
  {
    let pfAudio = PFAudio()
    pfAudio.play("https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3",
      podcastTitle: "fake podcast title",
      episodeTitle: "fake episode title",
      artworkUrl: nil)

    return pfAudio
  }

  func testRecord()
  {
    let pfAudio = setupForRecordingTest()

    expectationForCondition
    {
      return pfAudio.audioStreamRecorder != nil
    }
    waitForExpectationsWithTimeout(5)
    sleep(2)
    pfAudio.startRecording()
    sleep(7)

    let recordingSucceeds = expectationWithDescription("Recording returned an error or did not return a filePath")
    pfAudio.stopRecording
    {
      args in

      if let filePath = args[1] as? String where
        NSFileManager.defaultManager().fileExistsAtPath(filePath)
        && args[0] is NSNull
      {
        print("filePath: \(filePath)")
        if filePath.hasSuffix(".m4a")
        {
          recordingSucceeds.fulfill()
        }
      }

    }
    waitForExpectationsWithTimeout(10)
  }

}
