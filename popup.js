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

document.addEventListener('keydown', key => {
    let code = key.keyCode;
    if(code == 13){
        console.log("Enter key pressed");
        if (wordToSearch.val() === "") {
          meaning.empty();
          error.css('display', 'block');
          error.text('Please enter a word');
        } else {
          findBtn.click();
        }
    }
});


findBtn.click(() => {
  meaning.empty();
  if (wordToSearch.val() === "") {
    meaning.empty();
    error.css('display', 'block');
    error.text('Please enter a word');
  } else {
    handleSubmit();
  }
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
        meaning.append('Searching ...');
        meaning.empty();
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
