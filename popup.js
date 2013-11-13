var charactors = {};
chrome.storage.sync.set({'charactors': 'JSON.stringify(charactors)'}, function() {});
var isUpdated = false;
var betMade = false;
var whatHappend = {};

  function calculate(){

  charactors = chrome.storage.sync.get('charactors',  function() {});
  var req = new XMLHttpRequest();
  req.open("GET", "http://www.saltybet.com/state.json", false);
  req.send();
  whatHappend = JSON.parse(req.responseText);
  updateState(whatHappend);
  document.getElementById('in').innerHTML = "Player 1: " + whatHappend.p1name + "<br />Player 2: " + whatHappend.p2name + "<br />GameState : " + whatHappend.status;
  var names = 'Dinozord';
  var names2 = 'Kano';
  document.getElementById('out').innerHTML = JSON.stringify(charactors);
  chrome.storage.sync.set({'charactors': 'JSON.stringify(charactors)'}, function() {});

  }

  function updateState(source) {

    if(source.status == "locked"){

      isUpdated = false;
      betMade = false;

    } else if(source.status == 1 && !isUpdated){

      isUpdated = true;
      updateCharactorData(source.p1name, true);
      updateCharactorData(source.p2name, false);

    } else if(source.status == 2 && !isUpdated){

      isUpdated = true;
      updateCharactorData(source.p2name, true);
      updateCharactorData(source.p1name, false);

    } else if(source.status == "open" && !betMade){

      betMade = true;
      makeBet();

    }

  }

  function updateCharactorData(charactor, didWin){

    if(!charactors.hasOwnProperty(charactor)){
      addCharactor(charactor, didWin);
    }else{

      var wins = charactors[charactor].wins;
      var losses = charactors[charactor].losses;

      if(didWin){
        wins++;
      }else{
        losses++;
      }

      var ratio = wins/(wins+losses);

      props = {"wins":wins, "losses":losses, "ratio":ratio};

      charactors[charactor] = props;

    }

  }

  function addCharactor(charactor, didWin){


    if(didWin){
      var newOne = {"wins":1, "losses":0, "ratio":1.0};
    }else{
      var newOne = {"wins":0, "losses":1, "ratio":0.0};
    }

    charactors[charactor] = newOne;

  }

  function makeBet() {



  }

 
$("input[type=submit]").click(function () {
    var selectedPlayer = $(this).attr("name");
    $("#selectedplayer").val(selectedPlayer);
    
});

$(function () {
    $("form").bind("submit", function () {
            if (isNaN(Number($("#wager").val())) == true) {
                alert("Please enter a number.")
            } else {
                    $.ajax({
                        type: "post",
                        url: "http://www.saltybet.com/ajax_place_bet.php",
                        data: $("form").serialize(),
                        success: function () {
                            $('input[type="submit"]').attr("disabled", "disabled");
                            setTimeout(function () {
                                $('input[type="submit"]').removeAttr("disabled")
                            }, 3000)
                        }
                    });
                    return false
            }
        
    })
});

/*    chrome.storage.sync.set({'value': "testvalue"}, function() {
    // Notify that we saved.
  });  */

setInterval(calculate, 1000);

chrome.windows.onCreated.addListener(function() {
//chrome.tabs.create({url:"google.com"});
//setInterval(calculate, 1000);
})