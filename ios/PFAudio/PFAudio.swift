//
//  PFAudio.swift
//  podcastfooMobile
//
//  Created by Alonso Holmes on 9/26/15.
//

import Foundation
//import StreamingKit
import MediaPlayer
import FreeStreamer

@objc(PFAudio)
class PFAudio: NSObject, RCTInvalidating {

  var bridge: RCTBridge!
  var audioController: FSAudioController!

  // The URL source and metadata of the currently-playing audio
  var source: String = "";
  var podcastTitle: String = "";
  var episodeTitle: String = "";
  var podcastArtwork: UIImage?
  
  var currentTimeReportingTimer: NSTimer?;
  
  // Player state
  var playerState: String = "UNKNOWN";
  
  override init() {
    super.init();
    // Init audio player
    self.audioController = FSAudioController();
    self.audioController.onStateChange = self.handleStateChange;
    
//    self.player.delegate = self;
    self.listenForCommandCenterEvents();
    self.updateNowPlayingInfo();
  }
  
  func invalidate() {
    print("disposing!");
    self.unregisterCommandCenterEvents();
    if let timer = self.currentTimeReportingTimer {
      timer.invalidate();
    }
    runOnMain({
      self.audioController = nil;
      print("set audio controller to nil");
    })
//    self.player.dispose();
  }
  
//  func createNewStream() {
//    self.stream = nil;
//    self.stream = FSAudioStream();
//    self.stream.onStateChange = self.handleStateChange;
//  }
  
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
//    // Like
//    commandCenter.likeCommand.addTarget(self, action: "didReceiveLikeCommand:");
//    commandCenter.likeCommand.localizedTitle = "Like this Moment";
//    commandCenter.likeCommand.localizedShortTitle = "Like";
//    // Bookmark
//    commandCenter.bookmarkCommand.addTarget(self, action: "didReceiveBookmarkCommand:");
//    commandCenter.bookmarkCommand.localizedTitle = "Bookmark this Moment";
//    commandCenter.bookmarkCommand.localizedShortTitle = "Bookmark";
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
    print("got remote play command!");
    self.bridge.eventDispatcher.sendAppEventWithName("MTAudio.commandCenterPlayButtonTapped", body: NSNull())
    self.resume()
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceivePauseCommand(event:MPRemoteCommand) -> MPRemoteCommandHandlerStatus {
    print("got remote pause command!")
    self.bridge.eventDispatcher.sendAppEventWithName("MTAudio.commandCenterPauseButtonTapped", body: NSNull())
    self.pause()
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceiveSkipForwardCommand(event:MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
    self.bridge.eventDispatcher.sendAppEventWithName("MTAudio.commandCenterSkipForwardButtonTapped", body: NSNull())
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceiveSkipBackwardCommand(event:MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
    self.bridge.eventDispatcher.sendAppEventWithName("MTAudio.commandCenterSkipBackwardButtonTapped", body: NSNull())
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
    let isPlaying = self.audioController.isPlaying();
    let playbackRate:Float;
    if (isPlaying){
      playbackRate = 1;
    } else {
      playbackRate = 0;
    }
    
    let center = MPNowPlayingInfoCenter.defaultCenter();
    var info = center.nowPlayingInfo ?? [:];
    info[MPMediaItemPropertyTitle] = self.episodeTitle;
    info[MPMediaItemPropertyMediaType] = MPMediaType.Podcast.rawValue;
    info[MPMediaItemPropertyPodcastTitle] = self.podcastTitle;
    info[MPMediaItemPropertyArtist] = self.podcastTitle;
    info[MPNowPlayingInfoPropertyPlaybackRate] = playbackRate;
    info[MPNowPlayingInfoPropertyElapsedPlaybackTime] = self.audioController.activeStream.currentTimePlayed.playbackTimeInSeconds;
    info[MPMediaItemPropertyPlaybackDuration] = self.audioController.activeStream.duration.playbackTimeInSeconds;
    center.nowPlayingInfo = info;
  }
  
  // Sets the source audio URL (and begins buffering)
  @objc func play(source: String, podcastTitle: String, episodeTitle: String, artworkUrl: String?) -> Void {
    runOnMain({
      print(String(format: "MTAudio.play() called with url %@", source))
      
      // Not sure if this stops the previously-buffering audio source
//      self.stream.stop();
      
      // Create a new stream
//      self.createNewStream();
      
      // Store the new title
      self.podcastTitle = podcastTitle;
      self.episodeTitle = episodeTitle;
      self.source = source;
      
      // Construct the URL and set the data source
      let url = NSURL.init(string: source);
      self.audioController.playFromURL(url);
      
      if let artworkUrl = artworkUrl {
        // Fetch the image
        dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), {
          
          let artworkUrl = NSURL(string:artworkUrl);
          
          if let artworkUrl = artworkUrl {
            let artworkData = NSData(contentsOfURL: artworkUrl);
            
            if let artworkData = artworkData {
              let artwork = UIImage(data:artworkData);
              
              if let artwork = artwork {
                let center = MPNowPlayingInfoCenter.defaultCenter();
                var info = center.nowPlayingInfo ?? [:];
                info[MPMediaItemPropertyArtwork] = MPMediaItemArtwork(image: artwork);
                center.nowPlayingInfo = info;
              }
            }
          }
        })
      }
    })
  }
  
  @objc func pause() -> Void {
    runOnMain({
      if (self.audioController.isPlaying()) {
        self.audioController.pause();
      }
    });
  }
  
  @objc func resume() -> Void {
    runOnMain({
      if (!self.audioController.isPlaying()) {
        self.audioController.pause();
      }
    });
  }
  
  // Seeks to a specific timestamp
  // Attempt to buffer from this new timestamp instead
  @objc func seekToTime(timestamp: NSNumber) -> Void {
    runOnMain({
      var position = FSStreamPosition();
      position.minute = 0;
      position.second = timestamp.unsignedIntValue;
      print(position);
      
      // THIS IS SLOW - BLOCKS THE MAIN THREAD
      self.audioController.activeStream.seekToPosition(position);
      print("MTAudio.seek() called with timestamp \(timestamp)");
      self.emitStateChange();
    });
  }
  
  // Starts or stops a timer to report the current time every so often
  func startOrStopReportingCurrentTime() -> Void {
    if (self.playerState == "PLAYING" || self.playerState == "RETRYING_SUCCEEDED" || self.playerState == "SEEKING") {
      // Invalidate any
      if let timer = self.currentTimeReportingTimer {
        timer.invalidate();
      }
      self.currentTimeReportingTimer = NSTimer.scheduledTimerWithTimeInterval(0.5, target: self, selector: "emitStateChange", userInfo: nil, repeats: true);
    } else {
      // Stop reporting
      if let timer = self.currentTimeReportingTimer {
        timer.invalidate();
      }
    }
  }
  
  // Gets the audio player state as a raw string
  func playerStateAsString(state: FSAudioStreamState) -> String {
    switch state.rawValue {
    case 0:
      return "RETRIEVING_URL"
    case 1:
      return "STOPPED"
    case 2:
      return "BUFFERING"
    case 3:
      return "PLAYING"
    case 4:
      return "PAUSED"
    case 5:
      return "SEEKING"
    case 6:
      return "END_OF_FILE"
    case 7:
      return "FAILED"
    case 8:
      return "RETRYING_STARTED"
    case 9:
      return "RETRYING_SUCCEEDED"
    case 10:
      return "RETRYING_FAILED"
    case 11:
      return "PLAYBACK_COMPLETED"
    default:
      return "UNKNOWN"
    }
  }
  
  func handleStateChange(state: FSAudioStreamState) -> Void {
    self.playerState = self.playerStateAsString(state);
    print("state did change!", state, self.playerState);
    self.emitStateChange();
    // Start or stop the current time emission timer
    self.startOrStopReportingCurrentTime();
  }
  
  // Emits the updated state over the bridge to JS
  func emitStateChange() -> Void {
    // Bail if the audioController has been deallocated
    // This is necessary because it will emit a "STOPPED" event before dying
    if ((self.audioController == nil)) {
      return;
    }
    var state:Dictionary<String,AnyObject> = [:]
    // State
    state["playerState"] = self.playerState;
    // Duration
    var duration = self.audioController.activeStream.duration.playbackTimeInSeconds;
    if (duration.isNaN) {duration = 0};
    state["duration"] =  duration;
    // currentTime
    var playbackTimeInSeconds = self.audioController.activeStream.currentTimePlayed.playbackTimeInSeconds;
    if (playbackTimeInSeconds.isNaN) { playbackTimeInSeconds = 0 };
    state["currentTime"] =  playbackTimeInSeconds;
    // Source
    state["source"] = self.source;
//    print("updating state", state);
    self.bridge.eventDispatcher.sendAppEventWithName("MTAudio.updateState", body: state)
    // Update the now playing info
    self.updateNowPlayingInfo();
  }
  
//  /**
//  Delegate methods for the STKAudioPlayer
//  */
//  func audioPlayer(audioPlayer: STKAudioPlayer!, didStartPlayingQueueItemId queueItemId: NSObject!) {
//    print("audio player did start playing!");
//    self.emitStateChange();
//  }
//  
//  func audioPlayer(audioPlayer: STKAudioPlayer!, didFinishBufferingSourceWithQueueItemId queueItemId: NSObject!) {
//    print("did finish buffering!");
//    self.emitStateChange();
//  }
//  
//  func audioPlayer(audioPlayer: STKAudioPlayer!, stateChanged state: STKAudioPlayerState, previousState: STKAudioPlayerState) {
//    print("state changed!");
//    self.emitStateChange();
//    // Start or stop the current time emission timer
//    self.startOrStopReportingCurrentTime(state);
//  }
//  func audioPlayer(audioPlayer: STKAudioPlayer!, didFinishPlayingQueueItemId queueItemId: NSObject!, withReason stopReason: STKAudioPlayerStopReason, andProgress progress: Double, andDuration duration: Double) {
//    print("did finish playing!");
//  }
//  func audioPlayer(audioPlayer: STKAudioPlayer!, unexpectedError errorCode: STKAudioPlayerErrorCode) {
//    print("unexpected error!");
//  }
}