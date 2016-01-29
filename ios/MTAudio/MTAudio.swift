//
//  MTAudio.swift
//  podcastfooMobile
//
//  Created by Alonso Holmes on 9/26/15.
//

import Foundation
import StreamingKit
import MediaPlayer

@objc(MTAudio)
class MTAudio: NSObject, STKAudioPlayerDelegate, RCTInvalidating {
  
  // How you send events from Swift/ObjC to React/JS:
  // See https://facebook.github.io/react-native/docs/native-modules-ios.html#sending-events-to-javascript

  var bridge: RCTBridge!
  var player: STKAudioPlayer!

  // The URL source and metadata of the currently-playing audio
  var source:String?;
  var podcastTitle: String = "";
  var episodeTitle: String = "";
  
  var currentTimeReportingTimer: NSTimer?;
  
  override init() {
    super.init();
    // Init audio player
    self.player = STKAudioPlayer();
    self.player.delegate = self;
    // Handle command center events
//    self.commandCenter = MPRemoteCommandCenter.sharedCommandCenter();
    self.listenForCommandCenterEvents();
    self.updateNowPlayingInfo();
  }
  
  func invalidate() {
    self.unregisterCommandCenterEvents();
    if let timer = self.currentTimeReportingTimer {
      timer.invalidate();
    }
    self.player.dispose();
  }
  
  func listenForCommandCenterEvents() -> Void {
    let commandCenter = MPRemoteCommandCenter.sharedCommandCenter()
    // play/pause/skip
    commandCenter.playCommand.addTarget(self, action: "didReceivePlayCommand:");
    commandCenter.pauseCommand.addTarget(self, action: "didReceivePauseCommand:");
    let preferredSkipIntervals = [15]
    commandCenter.skipForwardCommand.enabled = true;
    commandCenter.skipBackwardCommand.enabled = true;
    commandCenter.skipForwardCommand.addTarget(self, action: "didReceiveSkipForwardCommand:");
    commandCenter.skipBackwardCommand.addTarget(self, action: "didReceiveSkipBackwardCommand:");
    commandCenter.skipForwardCommand.preferredIntervals = preferredSkipIntervals;
    commandCenter.skipBackwardCommand.preferredIntervals = preferredSkipIntervals;
    // Like
    commandCenter.likeCommand.addTarget(self, action: "didReceiveLikeCommand:");
    commandCenter.likeCommand.localizedTitle = "Like this Moment";
    commandCenter.likeCommand.localizedShortTitle = "Like";
    // Bookmark
    commandCenter.bookmarkCommand.addTarget(self, action: "didReceiveBookmarkCommand:");
    commandCenter.bookmarkCommand.localizedTitle = "Bookmark this Moment";
    commandCenter.bookmarkCommand.localizedShortTitle = "Bookmark";
    // Disabled commands
    commandCenter.nextTrackCommand.enabled = false;
    commandCenter.previousTrackCommand.enabled = false;
    commandCenter.stopCommand.enabled = false;
  }
  
  func unregisterCommandCenterEvents() -> Void {
    let commandCenter = MPRemoteCommandCenter.sharedCommandCenter()
    // play/pause/skip
    commandCenter.playCommand.removeTarget(self);
    commandCenter.pauseCommand.removeTarget(self);
    commandCenter.skipForwardCommand.removeTarget(self);
    commandCenter.skipBackwardCommand.removeTarget(self);
    // Like
    commandCenter.likeCommand.removeTarget(self);
    // Bookmark
    commandCenter.bookmarkCommand.removeTarget(self);
  }
  
  func didReceivePlayCommand(event:MPRemoteCommand) -> MPRemoteCommandHandlerStatus {
    print("got remote play command!")
    self.resume()
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceivePauseCommand(event:MPRemoteCommand) -> MPRemoteCommandHandlerStatus {
    print("got remote pause command!")
    self.pause()
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceiveSkipForwardCommand(event:MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
    print("skip forward command is not implemented")
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceiveSkipBackwardCommand(event:MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
    print("skip backward command is not implemented")
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceiveLikeCommand(event:MPFeedbackCommandEvent) -> MPRemoteCommandHandlerStatus {
    // Emit an event over the bridge
    self.bridge.eventDispatcher.sendAppEventWithName("MTAudio.favorite", body: []);
    // Set the command state to 'active'
    // Doesn't work, not sure why.
    let commandCenter = MPRemoteCommandCenter.sharedCommandCenter()
    commandCenter.likeCommand.active = true;
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceiveBookmarkCommand(event:MPRemoteCommand) -> MPRemoteCommandHandlerStatus {
    print("bookmark command is not implemented")
    return MPRemoteCommandHandlerStatus.Success
  }
  
  // TODO - now playing info
  func updateNowPlayingInfo() -> Void {
    // Get the current playback rate
    let playbackRate:Float;
    switch self.player.state.rawValue {
    case STKAudioPlayerStatePlaying.rawValue:
      playbackRate = 1;
    case STKAudioPlayerStateBuffering.rawValue:
      playbackRate = 0.00000001;
    default:
      playbackRate = 0;
    }
    let center = MPNowPlayingInfoCenter.defaultCenter()
    center.nowPlayingInfo = [
      MPMediaItemPropertyTitle: self.episodeTitle,
      MPMediaItemPropertyMediaType: MPMediaType.Podcast.rawValue,
      MPMediaItemPropertyPodcastTitle: self.podcastTitle,
      MPMediaItemPropertyArtist: self.podcastTitle,
      MPNowPlayingInfoPropertyPlaybackRate: playbackRate,
      MPNowPlayingInfoPropertyElapsedPlaybackTime: self.player.progress,
      MPMediaItemPropertyPlaybackDuration: self.player.duration
    ]
    
  }
  
  // Sets the source audio URL (and begins buffering)
  @objc func play(source: String, podcastTitle: String, episodeTitle: String) -> Void {
    print(String(format: "MTAudio.play() called with url %@", source))
    
    // Not sure if this stops the previously-buffering audio source
    self.pause();
    
    // Store the new title
    self.podcastTitle = podcastTitle;
    self.episodeTitle = episodeTitle;
    
    // Construct the URL and set the data source
    let url = NSURL.init(string: source);
    let source = STKAudioPlayer.dataSourceFromURL(url);
    self.player.setDataSource(source, withQueueItemId: nil);
  }
  
  @objc func pause() -> Void {
    self.player.pause();
  }
  
  @objc func resume() -> Void {
    self.player.resume();
  }
  
  // 
  // Basic playback controls
  //
//  
//  // Plays the currently selected source if possible, otherwise does nothing
//  @objc func play() -> Void {
//    print("MTAudio.play() called");
//    self.player.resume();
//    
//    // If this worked, then update the state
//    self.updateState("PLAYING");
//    
//    // Periodically (every 500ms or so) update the current time
//    let currentTime = 2.15;
//    self.updateCurrentTime(currentTime);
//  }
  
  // Seeks to a specific timestamp
  // Attempt to buffer from this new timestamp instead
  @objc func seekToTime(timestamp: NSNumber) -> Void {
    self.player.seekToTime(Double(timestamp));
    print("MTAudio.seek() called with timestamp \(timestamp)");
    self.emitStateChange();
  }
  
  // Starts or stops a timer to report the current time every so often
  func startOrStopReportingCurrentTime(state: STKAudioPlayerState) -> Void {
    switch state.rawValue {
      case STKAudioPlayerStatePlaying.rawValue:
        
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
    case STKAudioPlayerStateBuffering.rawValue:
      return "BUFFERING"
    case STKAudioPlayerStateDisposed.rawValue:
      return "DISPOSED"
    case STKAudioPlayerStateError.rawValue:
      return "ERROR"
    case STKAudioPlayerStatePaused.rawValue:
      return "PAUSED"
    case STKAudioPlayerStatePlaying.rawValue:
      return "PLAYING"
    case STKAudioPlayerStateReady.rawValue:
      return "READY"
    case STKAudioPlayerStateRunning.rawValue:
      return "RUNNING"
    case STKAudioPlayerStateStopped.rawValue:
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
    self.bridge.eventDispatcher.sendAppEventWithName("MTAudio.updateState", body: state)
    // Update the now playing info
    self.updateNowPlayingInfo();
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
  func audioPlayer(audioPlayer: STKAudioPlayer!, didFinishPlayingQueueItemId queueItemId: NSObject!, withReason stopReason: STKAudioPlayerStopReason, andProgress progress: Double, andDuration duration: Double) {
    print("did finish playing!");
  }
  func audioPlayer(audioPlayer: STKAudioPlayer!, unexpectedError errorCode: STKAudioPlayerErrorCode) {
    print("unexpected error!");
  }
}