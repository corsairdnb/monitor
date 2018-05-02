const Rx = window.rxjs

export function comments (channelId, interval = 5000) {
  return Rx.Observable.create(function (observer) {
    request(channelId).then(result => {
      observer.next(result)
    })
    setInterval(() => {
      request(channelId).then(result => {
        observer.next(result)
      })
    }, interval)
  })
}

function request (channelId) {
  return new Promise(resolve => {
    let request = gapi.client.youtube.search.list({
      part: 'id',
      channelId: channelId,
      eventType: 'live',
      maxResults: 1,
      type: 'video'
    })

    // get channel
    request.execute(response => {
      if (!response.items.length) {
        return resolve([])
      }
      let request = gapi.client.youtube.liveBroadcasts.list({
        part: 'id,snippet',
        id: response.items[0].id.videoId,
        fields: 'items/snippet/liveChatId'
      })

      // get live stream
      request.execute(response => {
        if (!response.items.length) {
          return resolve([])
        }
        let liveChatId = response.items[0].snippet.liveChatId

        let request = gapi.client.youtube.liveChatMessages.list({
          part: 'id,snippet',
          liveChatId: liveChatId
        })

        // get chat messages
        request.execute(response => {
          console.log(response);
          // TODO: get authors info
          if (!response.items.length) {
            return resolve([])
          }
          return resolve(response.items)
        })
      })
    })
  })
}
