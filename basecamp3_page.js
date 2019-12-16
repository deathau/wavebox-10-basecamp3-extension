const main = async function () {
  
  // check if the unread count has updated and pass it up to the wavebox script
  let prev
  const setCount = async function(next) {
    if (next !== prev) {
      window.postMessage({
        type: 'basecamp3_unreads',
        count: next
      }, '*' /* targetOrigin: any */);
      prev = next;
    }
  }

  // get the unread messages and pass them up to the wavebox script
  const getMessages = async function () {
    BC.fetch(BC.accountPath("/my/readings"), { as: "json" }).then((e) => {
      let messages = [];
      for (const i in e.unreads) {
        if (e.unreads.hasOwnProperty(i)) {
          const unread = e.unreads[i];
          // translate the message for wavebox
          messages.push({
            id: unread.id,
            title: unread.title,
            subtitle: `${unread.creator.name} - ${unread.bucket_name}`,
            date: Date.parse(unread.unread_at)
          });
        }
      }
      window.postMessage({
        type: 'basecamp3_messages',
        messages: messages
      }, '*' /* targetOrigin: any */);
    });
  }

  // send an updated count and get messages to send to wavebox
  const sendDetails = async function(count) {
    await setCount(count);
    await getMessages();
  }

  // add the event listener for when unreads change
  document.addEventListener("bc:unreads-change", function (e) {
    sendDetails(e.unreads.length);
  });

  // send the initial unreads on page load.
  sendDetails(BC.unreads.getTotal());
}

main()