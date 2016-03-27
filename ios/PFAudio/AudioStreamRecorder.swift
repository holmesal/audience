//
//  AudioStreamRecorder.swift
//  Podcastfoo
//
//  Created by Ethan Sherr on 3/27/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation
import FreeStreamer
import AudioToolbox
import MediaPlayer

class AudioStreamRecorder: NSObject, FSPCMAudioStreamDelegate, TPAACAudioConverterDelegate
{

  private var destinationFileLpcm: UnsafeMutablePointer<ExtAudioFileRef>?
  private var audioFilePathLpcm: String?
  private var audioFilePathM4a: String?

  func initRecording()
  {
    func audioFile(forPathComponent component: String) -> String
    {
      return (NSTemporaryDirectory() as NSString).stringByAppendingPathComponent(component)
    }
    let fileName = "podcastClip"
    let path = audioFile(forPathComponent: "\(fileName).lpcm")
    audioFilePathLpcm = path
    audioFilePathM4a = audioFile(forPathComponent: "\(fileName).m4a")

    let fileManager = NSFileManager.defaultManager()
    if fileManager.fileExistsAtPath(path)
    {
      try! fileManager.removeItemAtPath(path)
    }
    let pathUrl = NSURL.fileURLWithPath(path)
    var dstFormat = AudioStreamBasicDescription(
      mSampleRate: AVAudioSession.sharedInstance().sampleRate,
      mFormatID: kAudioFormatLinearPCM,
      mFormatFlags: kLinearPCMFormatFlagIsSignedInteger | kAudioFormatFlagsNativeEndian | kAudioFormatFlagIsPacked,
      mBytesPerPacket: 4,
      mFramesPerPacket: 1,
      mBytesPerFrame: 4,
      mChannelsPerFrame: 2,
      mBitsPerChannel: 16,
      mReserved: 0)

    destinationFileLpcm = UnsafeMutablePointer<COpaquePointer>.alloc(1)
    let result = ExtAudioFileCreateWithURL(
      pathUrl,
      kAudioFileCAFType,
      &dstFormat,
      nil,
      AudioFileFlags.EraseFile.rawValue,
      destinationFileLpcm!)

    print(result)
  }

  func teardownRecording()
  {
    destinationFileLpcm?.dealloc(1)
    isRecording = false
    audioFilePathLpcm = nil
    audioFilePathM4a = nil
    finishedRecordingCallback = nil
  }

  var isRecording = false
  func startRecord()
  {
    guard !isRecording
    else
    {
      print("Warning, call to startRecording when already recording.")
      return
    }

    initRecording()
    isRecording = true
  }

  private var audioConverter: TPAACAudioConverter?
  private var finishedRecordingCallback: RCTResponseSenderBlock?
  func stopRecording(callback: RCTResponseSenderBlock? = nil)
  {

    guard let filePathLpcm = audioFilePathLpcm,
          let filePathM4a = audioFilePathM4a
    else
    {
      recordingFailedWithError(errorWithReason("No filePath was associated with recording."))
      return
    }

    guard isRecording
    else
    {
      recordingFailedWithError(errorWithReason("Recording was not in progress."))
      return
    }

    finishedRecordingCallback = callback

    audioConverter = TPAACAudioConverter(delegate: self, source: filePathLpcm, destination: filePathM4a)
    audioConverter?.start()
  }

  func recordingFailedWithError(error: NSError)
  {
    finishedRecordingCallback?([error, NSNull()])
    teardownRecording()
  }

  func errorWithReason(failureReason: String) -> NSError
  {
    let userInfo = [
      NSLocalizedDescriptionKey: NSLocalizedString("Unable to record stream audio.", comment: "User failed to record audio clip"),
      NSLocalizedFailureReasonErrorKey: NSLocalizedString(failureReason, comment: "Audio recording failure reason")
    ]

    return NSError(domain: "AudioStreamError", code: -2000, userInfo: userInfo)
  }

  func audioStream(
    audioStream: FSAudioStream!,
    samplesAvailable samples: UnsafeMutablePointer<AudioBufferList>,
    frames: UInt32,
    description: AudioStreamPacketDescription)
  {
    if let destinationFile = destinationFileLpcm where isRecording
    {
      ExtAudioFileWriteAsync(destinationFile.memory, frames, samples);
    }
  }


  //TPAACAudioConverterDelegate methods

  func AACAudioConverter(converter: TPAACAudioConverter!, didFailWithError error: NSError!) {
    recordingFailedWithError(error)
  }

  func AACAudioConverterDidFinishConversion(converter: TPAACAudioConverter!) {
    guard let pathM4a = audioFilePathM4a
    else
    {
      recordingFailedWithError(errorWithReason("No m4a filePath was associated with recording."))
      return
    }
    finishedRecordingCallback?([NSNull(), pathM4a])
    teardownRecording()
  }

  func AACAudioConverter(converter: TPAACAudioConverter!, didMakeProgress progress: Float) {
    print("progress \(progress)")
  }
}
