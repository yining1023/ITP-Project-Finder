var projectsList;

function getInput(event) {
  var val = document.getElementById('theInput').value;
  if(!val || val=="") return alert("Enter a keyword");
  getProjects(val);
}

function getProjects(userInput) {
  $.ajax({
    type: "GET",
    url: "" + userInput,
    failure: function(err){
      return alert ("Sorry, we could not find any data from api.");
    },
    success: function(data) {
      var obj = JSON.parse(data);
      if (obj.length === 0) {
        return alert ("Sorry, we could not find any project. Please try other keywords");
      } else {
        findName(obj);
        addCard(obj);
        showProject(projectsList);
        addSubUrl();
      }
    }
  });
}

function findName(obj) {
  var creatorNames = [];
  for (var i = 0; i < obj.length; i++) {
    $.ajax({
      type: "GET",
      indexValue: i,
      url: "" + obj[i].user,
      failure: function(err){
        return console.log("Sorry, we could not find name for this netID.");
      },
      success: function(nameinfo) {
        getCreatorName(nameinfo, this.indexValue);

        function getCreatorName(nameinfo, i) {
          var nameObj = JSON.parse(nameinfo);
          var creatorName = nameObj.official_name;
          obj[i].creatorName = creatorName;
        }
      }
    });
  }
}

function addCard(obj) {
  console.log('run addcard');
  $("#card-holder").empty();
  $("#mainImage").empty();
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].keywords == null) {
      var keywords = '';
    } else {
      var keywords = obj[i].keywords;
    }
    if (obj[i].creatorName == undefined) {
      var thisCreatorName = obj[i].user;
    } else {
      var thisCreatorName = obj[i].creatorName;
    }

    // add content to the image card
    var htmlToAppend = 
    "<div class='card-container col-sm-4 col-md-4 centered'>"+
      "<div class='card overlay white' data-toggle='modal' data-target='#exampleModal'>"+
        "<div class='card-text'>"+
          '<h3>'+obj[i].name+'</h3>'+
          '<h4>'+thisCreatorName+'</h4>'+
          '<p>'+keywords+'</p>'+
        "</div>"+
      '</div>'+
    '</div>';
    $('#card-holder').append(htmlToAppend);

    var cards = document.getElementsByClassName('card');
    var imgUrl = 'url(' + obj[i].main_img + ')';
    if (obj[i].main_img !== false) {
      cards[cards.length-1].style.backgroundImage = imgUrl;
    } else {
      cards[cards.length-1].style.backgroundColor = 'white';
    }

    // add data-whatever: obj[i].id to each card div
    var cards = document.getElementsByClassName('card');
    var thisCard = cards[cards.length-1];
    thisCard.setAttribute("data-whatever", obj[i].id);
    thisCard.setAttribute("href", obj[i].name);
  }
  projectsList = obj;
}

function showProject(projectsList) {
  console.log('run show projects');
  $('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var projectId = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    
    // Use projectId to find all infos in the projectsList
    for (var j = 0; j < projectsList.length; j++) {
      if (projectId == projectsList[j].id) {
        // add content to the overlay modal
        if (projectsList[j].keywords == null) {
          var keywords = '';
        } else {
          var keywords = projectsList[j].keywords;
        }
        if (projectsList[j].creatorName == undefined) {
          var thisCreatorName = projectsList[j].user;
        } else {
          var thisCreatorName = projectsList[j].creatorName;
        }

        $('#exampleModalLabel').html(projectsList[j].name);
        $('#author').html(thisCreatorName);
        $('#keywords').html('<b>Keywords: </b>' + keywords);
        if (projectsList[j].main_img !== false) {
          var img = document.createElement("IMG");
          img.src = projectsList[j].main_img;
          $('#mainImage').html(img);
        } else {
          $('#mainImage').html('');
        }
        $('#pitch').html('<b>Elevator Pitch:</b>  </br>' + projectsList[j].elevator_pitch);
        $('#description').html('<b>Description:</b>  </br>' + projectsList[j].description);
      }
    }
  })
}

function addSubUrl() {
  console.log('run addsuburl');
  $(window.location.hash).modal('show');
  $('div[data-toggle="modal"]').click(function(){
    window.location.hash = $(this).attr('href');
  });

  $('button[data-dismiss="modal"]').click(function(){
    var original = window.location.href.substr(0, window.location.href.indexOf('#'))
    history.replaceState({}, document.title, original);
  });

  $(window.location.hash).modal('show');
  $('a[data-toggle="modal"]').click(function(){
    window.location.hash = $(this).attr('href');
  });

  $('.modal').on('hidden.bs.modal', function () {
    revertToOriginalURL();
  });
}

function revertToOriginalURL() {
  var original = window.location.href.substr(0, window.location.href.indexOf('#'))
  history.replaceState({}, document.title, original);
}

document.getElementById('theInput').addEventListener('change', getInput);
