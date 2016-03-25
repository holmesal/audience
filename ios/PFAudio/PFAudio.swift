//
//  PFAudio.swift
//  podcastfooMobile
//
//  Created by Alonso Holmes on 9/26/15.
//

import Foundation
import MediaPlayer
import FreeStreamer

@objc(PFAudio)
class PFAudio: NSObject, RCTInvalidating {
  
  // The bridge to magical js-land
  var bridge: RCTBridge!
  
  // Using FSAudioController instead of FSAudioStream because controller handles changing URLs better
  var audioController: FSAudioController!

  // The info for the currently-playing track
  var source: String = "";
  var podcastTitle: String = "";
  var episodeTitle: String = "";
  var podcastArtwork: UIImage?
  
  // A timer that, when activated, will report the current time a couple times a second
  var currentTimeReportingTimer: NSTimer?;
  
  // String representation of audio player state
  var playerState: String = "UNKNOWN";
  var currentSeekByteOffset: FSSeekByteOffset = FSSeekByteOffset(start: 0, end: 0, position: 0.0);
  
  
  override init() {
    super.init();
    // Init audio player
    self.audioController = FSAudioController();
    self.audioController.onStateChange = self.handleStateChange;
    self.listenForCommandCenterEvents();
    self.updateNowPlayingInfo();
  }
  
  // Invalidate is called by react-native before this instance is released
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
  }
  
  // Decide which command center events will be enabled/disabled, and start listening for them
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
  
  // Stop listening for command center events
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
    self.bridge.eventDispatcher.sendAppEventWithName("PFAudio.commandCenterPlayButtonTapped", body: NSNull())
    self.resume()
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceivePauseCommand(event:MPRemoteCommand) -> MPRemoteCommandHandlerStatus {
    print("got remote pause command!")
    self.bridge.eventDispatcher.sendAppEventWithName("PFAudio.commandCenterPauseButtonTapped", body: NSNull())
    self.pause()
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceiveSkipForwardCommand(event:MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
    self.bridge.eventDispatcher.sendAppEventWithName("PFAudio.commandCenterSkipForwardButtonTapped", body: NSNull())
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceiveSkipBackwardCommand(event:MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
    self.bridge.eventDispatcher.sendAppEventWithName("PFAudio.commandCenterSkipBackwardButtonTapped", body: NSNull())
    return MPRemoteCommandHandlerStatus.Success
  }
  
  func didReceiveLikeCommand(event:MPFeedbackCommandEvent) -> MPRemoteCommandHandlerStatus {
    // Emit an event over the bridge
    self.bridge.eventDispatcher.sendAppEventWithName("PFAudio.favorite", body: []);
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
  
  // Update the command center now-playing info
  func updateNowPlayingInfo() -> Void {
    // Command center uses a playback rate to increment current time
    // We might actually want to do this in JS-land too, it would reduce some of the tight coupling probems we have right now
    let isPlaying = self.audioController.isPlaying();
    let playbackRate:Float;
    if (isPlaying){
      playbackRate = 1;
    } else {
      playbackRate = 0;
    }
    // Update the center info
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
  
  // Play a stream
  @objc func play(source: String, podcastTitle: String, episodeTitle: String, artworkUrl: String?) -> Void {
    runOnMain({
      print(String(format: "PFAudio.play() called with url %@", source))
      
      // Store relevant info, so that it can be used to update the command center later
      self.podcastTitle = podcastTitle;
      self.episodeTitle = episodeTitle;
      self.source = source;
      
      // Reset the current seek byte offset
      self.currentSeekByteOffset = FSSeekByteOffset(start: 0, end: 0, position: 0.0);
      
      // Construct the URL and set the data source
      let url = NSURL.init(string: source);
      // Play
      self.audioController.playFromURL(url);
      
      // If an artwork url was provided, fetch it
      // [Alonso] sometimes this fails - why???
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
      self.currentSeekByteOffset = self.audioController.activeStream.currentSeekByteOffset;
      if (self.audioController.isPlaying()) {
        self.audioController.pause();
      }
    });
  }
  
  @objc func resume() -> Void {
    runOnMain({
      // play from offset
      if (!self.audioController.isPlaying()) {
        // UGH DOES NOT WORK
//        print("playing from offset", self.currentSeekByteOffset);
//        self.audioController.activeStream.playFromOffset(self.currentSeekByteOffset);
        self.audioController.pause(); // pause to resume lol
        if (self.audioController.activeStream.currentTimePlayed.position != self.currentSeekByteOffset.position) {
          var position = FSStreamPosition();
          position.position = self.currentSeekByteOffset.position;
          print("resuming to position: ", position);
          self.audioController.activeStream.seekToPosition(position)
        }
      }
    });
  }
  
  // Seeks to a specific timestamp
  @objc func seekToTime(timestamp: NSNumber) -> Void {
    runOnMain({
      // Need a position struct to update current timestamp
      var position = FSStreamPosition();
//      let minutes = timestamp.floatValue / 60.0 as NSNumber;
//      let seconds = timestamp.floatValue - (minutes.floatValue * 60) as NSNumber;
//      position.minute = minutes.unsignedIntValue;
//      position.second = seconds.unsignedIntValue; // is this bad?
      let duration = self.audioController.activeStream.duration.playbackTimeInSeconds;
      if (duration > 0.0) {
        var targetPosition = timestamp.floatValue / duration;
        // If we're beyond the end, abort the seek
        if (targetPosition > 1.0) {
          targetPosition = 1.0;
//          return;
        }
        position.position = targetPosition;
//        print("seeking to", position, "out of", duration);
        self.currentSeekByteOffset.position = targetPosition;
        
        // THIS IS SLOW - BLOCKS THE MAIN THREAD
        // TODO - can the audioController run on a background thread?
        self.audioController.activeStream.seekToPosition(position);
        // Emit the updated state
        self.emitStateChange();
      } else {
        print("duration is 0 - not seeking!");
      }
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
    // This is necessary because it will emit a "STOPPED" event before dying, *after* it's been set to nil? It's a thread thing I don't understand
    if ((self.audioController == nil)) {
      return;
    }
    var state:Dictionary<String,AnyObject> = [:]
    // State
    state["playerState"] = self.playerState;
    // Duration
    var duration = self.audioController.activeStream.duration.playbackTimeInSeconds;
//    print("duration = ", duration);
//    print("current byte seek offset = ", self.audioController.activeStream.currentSeekByteOffset);
//    print("current position = ", self.audioController.activeStream.currentTimePlayed);
    // Duration is sometimes NaN?
    if (duration.isNaN) {duration = 0};
    // Bail if we're seeking and the duration is 0
    if (duration == 0.0 && (self.playerState == "BUFFERING" || self.playerState == "SEEKING" || self.playerState == "PLAYING")) {
      print("duration was 0 for playerState: ", self.playerState, "skipping this state update");
      return
    };
    state["duration"] =  duration;
    // currentTime
    var playbackTimeInSeconds = self.audioController.activeStream.currentTimePlayed.playbackTimeInSeconds;
    if (playbackTimeInSeconds.isNaN) { playbackTimeInSeconds = 0 };
    state["currentTime"] =  playbackTimeInSeconds;
    // Source
    state["source"] = self.source;
    self.bridge.eventDispatcher.sendAppEventWithName("PFAudio.updateState", body: state)
    // Update the now playing info
    self.updateNowPlayingInfo();
  }
  
  
  
  
  
  
  // Start recording
  func startRecording() -> Void {
    print("PFAudio.startRecording() called!");
  }
  
  // Stops recording, converts the recorded pcm audio to mp4, and calls the callback with the filepath to that mp4
  func stopRecording(callback: RCTResponseSenderBlock) -> Void {
    print("PFAudio.stopRecording() called!");
    
    // https://github.com/michaeltyson/TPAACAudioConverter for conversion to m4a?
    callback([NSNull(), "path/to/clip.m4a"]);
  }
}