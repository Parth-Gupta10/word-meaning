let findBtn = $('#submit');
let meaning = $('#meaning');
let wordToSearch = $('#wordToSearch');
let error = $('#error');

// chrome.tabs.executeScript(integer tabId(optional, default: current window), object details, function callback)

chrome.tabs.executeScript({
    code: 'window.getSelection().toString();'
  },
  selection => {
    console.log(selection[0]);
    if (selection)
      wordToSearch.val(selection[0]);
    else
      wordToSearch.val("");
  }
);

findBtn.click(() => {
  meaning.empty();
  handleSubmit();
})

function handleSubmit() {
  console.log(wordToSearch.val());
  const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + wordToSearch.val();
  fetch(url)
    .then(res => res.json())
    .then(data => {
      meaning.css('display', 'block');
      console.log(data);
      if (data.title === "No Definitions Found") {
        error.css('display', 'block');
        error.text('No such word was found');

      } else if (data.title === 'Something Went Wrong.' || data.title === 'API Rate Limit Exceeded') {
        error.css('display', 'block');
        error.text('Please try after some time - server error');

      } else {
        error.css('display', 'none');
        for (var i = 0; i < data.length; i++) {
          let txtMain = `<li>
            <strong style="text-transform: capitalize">${data[i].word}</strong><sup>${i + 1}</sup>
              <ol id="sublist${i}"> </ol>
          </li>`;
          meaning.append(txtMain);
        }

        for (var k = 0; k < data.length; k++) {
          for (var i = 0; i < data[k].meanings.length; i++) {
            for (var j = 0; j < data[k].meanings[i].definitions.length; j++) {
              let txtSub = `<li>
                ${data[k].meanings[i].definitions[j].definition} [<em>${data[k].meanings[i].partOfSpeech}</em>]
              </li>`;
              $('#sublist' + k).append(txtSub)
            }
          }
        }

      }
    })
    .catch(err => {
      console.log('error: ', err);
    })
}
