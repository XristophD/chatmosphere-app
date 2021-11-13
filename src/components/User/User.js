import React, { useCallback, useEffect } from 'react';
import { useConferenceStore } from './../../store/ConferenceStore';
import { ReloadHint } from '../ReloadHint/ReloadHint';
import { AudioTrack } from './AudioTrack';
import { MuteIndicator } from './MuteIndicator';
import { VideoTrack } from './VideoTrack';
import { NameTag } from '../NameTag/NameTag';
import { MegaphoneIndicator } from './MegaphoneIndicator';
import useSound from 'use-sound';
import micTapSfx from './../../assets/sounds/micTap.mp3';


export const User = ({id, user}) => {

  const myPos = useConferenceStore(useCallback(store => store.users[id]['pos'], [id]))
  const myVolume = useConferenceStore(useCallback(store => store.users[id]['volume'], [id]))
  const isMute = useConferenceStore(useCallback(store => store.users[id]['mute'],[id]))
  const calculateVolume = useConferenceStore(useCallback(store => store.calculateVolume, []))
  const [playSfx] = useSound(micTapSfx)

  useEffect(() => {
    calculateVolume(id)
  },[id, calculateVolume, myPos])

  useEffect(()=> {
    if(user.properties?.megaphone === "true") playSfx()
  },[playSfx, user.properties?.megaphone])

  return(
    <div style={{position:'absolute', left:`${myPos.x}px`, top:`${myPos.y}px`}} className="userContainer" >
      <VideoTrack id={id} />
      <ReloadHint />
      <AudioTrack id={id} volume={myVolume} />
      <NameTag>{user?.user?._displayName || 'Friendly Sphere'}</NameTag>
      <div>Volume {Math.round(myVolume * 11)}</div>
      {isMute && <MuteIndicator>🤭</MuteIndicator>}
      {user.properties?.megaphone === "true" && <MegaphoneIndicator />}
    </div>
  )
}


