// import { Rx } from '../node_modules/rxjs/Rx.js'
// import { Observable } from '../node_modules/rxjs/Observable.js

const Rx = window.rxjs

export function comments (channelId) {
  let myObservable = Rx.Observable.create(observer => {
    observer.next(request(channelId))
    setInterval(() => observer.next(request(channelId)), 2000)
  })

  return myObservable
}

function request (channelId) {
  let request = gapi.client.youtube.search.list({
    part: 'id',
    channelId: channelId,
    eventType: 'live',
    maxResults: 1,
    type: 'video'
  })

  request.execute(response => {
    if (!response.items.length) {
      return []
    }
    let request = gapi.client.youtube.liveBroadcasts.list({
      part: 'id,snippet',
      id: response.items[0].id.videoId,
      fields: 'items/snippet/liveChatId'
    })

    request.execute(response => {
      if (!response.items.length) {
        return []
      }
      let liveChatId = response.items[0].snippet.liveChatId

      let request = gapi.client.youtube.liveChatMessages.list({
        part: 'id,snippet',
        liveChatId: liveChatId
      })

      request.execute(response => {
        if (!response.items.length) {
          return []
        }
        return response.items
      })
    })
  })
}
