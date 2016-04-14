//
//  MTAudioClip.swift
//  podcastfooMobile
//
//  Created by Alonso Holmes on 9/26/15.
//

import Foundation
//import StreamingKit
import MediaPlayer

@objc(MTAudioClip)
class MTAudioClip: NSObject, STKAudioPlayerDelegate, RCTInvalidating {
  
  var bridge: RCTBridge!
  var player: STKAudioPlayer!
  
  // The URL source and metadata of the currently-playing audio
  var source: String = "";
  
  var currentTimeReportingTimer: NSTimer?;
  
  override init() {
    super.init();
    // Init audio player
    self.player = STKAudioPlayer();
    self.player.delegate = self;
  }
  
  func invalidate() {
    if let timer = self.currentTimeReportingTimer {
      timer.invalidate();
    }
    self.player.dispose();
  }
  
  // Sets the source audio URL (and begins buffering)
  @objc func play(source: String) -> Void {
    print(String(format: "MTAudioClip.play() called with url %@", source))
    
    // Not sure if this stops the previously-buffering audio source
    self.pause();
    
    // Store the source
    self.source = source;
    
    // Construct the URL and set the data source
    let url = NSURL.init(string: source);
    let source = STKAudioPlayer.dataSourceFromURL(url!);
    self.player.setDataSource(source, withQueueItemId: NSNull());
    
}
  
  @objc func pause() -> Void {
    self.player.pause();
  }
  
  @objc func resume() -> Void {
    self.player.resume();
  }
  
  // Seeks to a specific timestamp
  // Attempt to buffer from this new timestamp instead
  @objc func seekToTime(timestamp: NSNumber) -> Void {
    self.player.seekToTime(Double(timestamp));
    print("MTAudioClip.seek() called with timestamp \(timestamp)");
    self.emitStateChange();
  }
  
  // Starts or stops a timer to report the current time every so often
  func startOrStopReportingCurrentTime(state: STKAudioPlayerState) -> Void {
    switch state.rawValue {
    case STKAudioPlayerState.Playing.rawValue:
      
      // Invalidate any
      if let timer = self.currentTimeReportingTimer {
        timer.invalidate();
      }
      self.currentTimeReportingTimer = NSTimer.scheduledTimerWithTimeInterval(0.5, target: self, selector: "emitStateChange", userInfo: nil, repeats: true);
    default:
      // Stop reporting
      if let timer = self.currentTimeReportingTimer {
        timer.invalidate();
      }
    }
  }
  
  // Gets the audio player state as a raw string
  func playerStateAsString() -> String {
    switch self.player.state.rawValue {
    case STKAudioPlayerState.Buffering.rawValue:
      return "BUFFERING"
    case STKAudioPlayerState.Disposed.rawValue:
      return "DISPOSED"
    case STKAudioPlayerState.Error.rawValue:
      return "ERROR"
    case STKAudioPlayerState.Paused.rawValue:
      return "PAUSED"
    case STKAudioPlayerState.Playing.rawValue:
      return "PLAYING"
    case STKAudioPlayerState.Ready.rawValue:
      return "READY"
    case STKAudioPlayerState.Running.rawValue:
      return "RUNNING"
    case STKAudioPlayerState.Stopped.rawValue:
      return "STOPPED"
    default:
      return "UNKNOWN"
    }
  }
  
  // Emits the updated state over the bridge to JS
  func emitStateChange() -> Void {
    var state:Dictionary<String,AnyObject> = [:]
    state["duration"] = self.player.duration ?? 0
    // TODO - player state
    state["playerState"] = self.playerStateAsString()
    state["currentTime"] = self.player.progress ?? 0
    state["source"] = self.source;
    self.bridge.eventDispatcher.sendAppEventWithName("MTAudioClip.updateState", body: state)
  }
  
  /**
   Delegate methods for the STKAudioPlayer
   */
  func audioPlayer(audioPlayer: STKAudioPlayer!, didStartPlayingQueueItemId queueItemId: NSObject!) {
    print("audio player did start playing!");
    self.emitStateChange();
  }
  
  func audioPlayer(audioPlayer: STKAudioPlayer!, didFinishBufferingSourceWithQueueItemId queueItemId: NSObject!) {
    print("did finish buffering!");
    self.emitStateChange();
  }
  
  func audioPlayer(audioPlayer: STKAudioPlayer!, stateChanged state: STKAudioPlayerState, previousState: STKAudioPlayerState) {
    print("state changed!");
    self.emitStateChange();
    // Start or stop the current time emission timer
    self.startOrStopReportingCurrentTime(state);
  }
  func audioPlayer(audioPlayer: STKAudioPlayer, didFinishPlayingQueueItemId queueItemId: NSObject, withReason stopReason: STKAudioPlayerStopReason, andProgress progress: Double, andDuration duration: Double) {
    print("did finish playing: ", queueItemId, stopReason, progress, duration);
    self.bridge.eventDispatcher.sendAppEventWithName("MTAudioClip.finishedPlaying", body: nil)
  }
  func audioPlayer(audioPlayer: STKAudioPlayer!, unexpectedError errorCode: STKAudioPlayerErrorCode) {
    print("unexpected error!");
  }
}