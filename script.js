class Player {
    constructor(data, pos, games, name) {
        this.data = data;
        this.pos = pos;
        this.games = games;
        this.name = name;
    }
}
var playersByPositionMap = new Map();
const playerList = [];

const options = {
    method: 'GET',
    url: 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeamSchedule',
    params: {
      teamAbv: 'SF',
      season: '2023'
    },
    headers: {
        'X-RapidAPI-Key': '5188014082mshe8cdcdb56e9a9d8p1ec5e2jsn869af1202774',
        'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
    }
  };

const media = {
    method: 'GET',
    url: 'https://americanfootballapi.p.rapidapi.com/api/american-football/team/4389/media',
    headers: {
        'X-RapidAPI-Key': '5188014082mshe8cdcdb56e9a9d8p1ec5e2jsn869af1202774',
        'X-RapidAPI-Host': 'americanfootballapi.p.rapidapi.com'
    }
};

const logos = {
  method: 'GET',
  url: 'https://americanfootballapi.p.rapidapi.com/api/american-football/team/4388/image',
  headers: {
    'X-RapidAPI-Key': '5188014082mshe8cdcdb56e9a9d8p1ec5e2jsn869af1202774',
    'X-RapidAPI-Host': 'americanfootballapi.p.rapidapi.com'
  }
};

const players = {
  method: 'GET',
  url: 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeamRoster',
  params: {
    teamAbv: 'SF',
    getStats: 'true'
  },
  headers: {
    'X-RapidAPI-Key': '5188014082mshe8cdcdb56e9a9d8p1ec5e2jsn869af1202774',
    'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
  }
};
  
const stories = {
    method: 'GET',
    url: 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLNews',
    params: {
        topNews: 'true',
        fantasyNews: 'false',
        recentNews: 'true',
        maxItems: '10'
    },
    headers: {
        'X-RapidAPI-Key': '5188014082mshe8cdcdb56e9a9d8p1ec5e2jsn869af1202774',
        'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
    }
};

  const cachedData = localStorage.getItem('cachedData');

  if (cachedData) {
    console.log("using cached.")

    //log the data
    console.log(JSON.parse(cachedData));

    //populate schedule
    populateSchedule(JSON.parse(cachedData));

    //populate players
    populatePlayers(JSON.parse(cachedData));

    //populate stories
    populateStories(JSON.parse(cachedData));

  //if no cached data, call APIs
  } else {
    let cacheSchedule;
    let cachePlayers;
    let cacheMedia;
    let cacheStories;

    //call stories API
    try {
        const storiesResponse = await axios.request(stories);
        console.log(storiesResponse.data);

        cacheStories = storiesResponse;

    } catch (error) {
        console.error(error);
    }

    //call media API
    try {
        const mediaResponse = await axios.request(media);
        console.log(mediaResponse.data);

        cacheMedia = mediaResponse.data;

    } catch (error) {
        console.error(error);
    }

    //call schedule API
    try {
        const scheduleResponse = await axios(options);  // Use axios instead of request
        console.log(scheduleResponse.data); //log the response

        cacheSchedule = scheduleResponse.data;

    } catch (error) {
        console.error(error);
    }

    //call player data API
    try {
        const playerResponse = await axios(players);
        console.log(playerResponse.data);

        cachePlayers = playerResponse.data;

    } catch (error) {
        console.error(error);
    }

    var combinedData = {
        schedule: cacheSchedule,
        players: cachePlayers,
        media: cacheMedia,
        stories: cacheStories
      };

    localStorage.setItem('cachedData', JSON.stringify(combinedData));

    //log the data
    console.log(JSON.parse(cachedData));

    //populate schedule
    populateSchedule(JSON.parse(cachedData));

    //populate players
    populatePlayers(JSON.parse(cachedData));

    //populate stories
    populateStories(JSON.parse(cachedData));

  }

  function getYouTubeVideoId(url) {
    //console.log(url);
    // Regular expression to extract the video ID from a YouTube URL
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = url.match(regex);

    // Check if a match is found and return the video ID
    return match ? match[1] : null;
}

  function populateGameMedia(data, game) {
    var link = document.createElement('a');

    data.media.media.forEach(video => {
        if (video.title.includes(game.homePts) && video.title.includes(game.awayPts)) {
            if (game.gameStatus === "Completed") {
                if (video.subtitle === "Full Highlights") {
                    link.href = video.url;
                }
            }
            else {
                if (video.subtitle === "Game Preview") {
                    link.href = video.url;
                }
            }
        }
    });

    let videoId = getYouTubeVideoId(link.href);
    link.target = '_blank'; //open in a new tab or window

    //create an image element for the thumbnail
    var thumbnail = document.createElement('img');

    // Set the src attribute for the thumbnail
    thumbnail.src = 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';
    thumbnail.alt = 'Video Thumbnail'; //alt text

    // Append the thumbnail to the link
    link.appendChild(thumbnail);

    return link;
  }

  function populatePlayerImage(data) {

  }

  function populateLogos(data) {

  }

  function populateStories(data) {

  }

  function populatePlayers(data) {
    let positionSet = new Set();
    let wrCount = 1;
    const playerCardsContainer = document.getElementById('player-cards');

    data.players.body.roster.forEach(player => {
        var nameParts = player.espnName.split(' ');
        var firstName = nameParts[0];
        var lastName = nameParts[1];

        let p = new Player(`
        <img src="${player.espnHeadshot}" alt="${player.espnName}">
        <h3>${player.pos}</h3>
        <p>${firstName} <br> ${lastName}</p>
        <button class="show-backups-btn" onclick="toggleBackups('${player.pos}')">Show More</button>
        `, player.pos, player.stats.gamesPlayed, player.espnName);

        if (!playersByPositionMap.has(player.pos)) {
            playersByPositionMap.set(player.pos, []);
        }

        //add the player to the array associated with their position
        playersByPositionMap.get(player.pos).push(p);
    });

    function compareByPosition(player1, player2) {
        const customOrder = ['QB', 'RB', 'WR 1', 'WR 2', 'WR 3', 'WR 4', 'TE', 'FB', 'DE', 'DT', 'OT', 'C', 'CB', 'S', 'LB', 'PK', 'G', 'LB', 'LS', 'P', ];

        // Get the index of each player's position in the customOrder array
        const index1 = customOrder.indexOf(player1.pos);
        const index2 = customOrder.indexOf(player2.pos);

        // Compare based on the custom order indices
        return index1 - index2;
    }

    //iterate through the map and add all the starters to the list to display
    playersByPositionMap.forEach((players, position) => {
        //iterate through all the players and find the one with the most games played to find the starter
        //set default player w/ 0s to initialize the first player as most games
        var mostPlayed = new Player(0, 0, 0, "default");

        //in the case of none wr, find most played games
        if (position != "WR") {
            players.forEach(player => {
                if (Number(player.games) > Number(mostPlayed.games)) {
                    mostPlayed = player;
                }
            });
        

            //if the players have no stats, TODO
            if (mostPlayed.name === "default") {
                playerList.push(players[0]);
            }
            else {
                playerList.push(mostPlayed);
            }
        }
        //if wr, use the top 4
        else {
            let wrList = [];
            for (let i = 0; i < players.length; i++) {
                //if there is no data, set to 0
                if (players[i].games === undefined) {
                    players[i].games = 0;
                }

                //add the wr to wr list
                wrList.push(players[i]); 
            }

            //sort decreasing by games played
            wrList.sort((a,b) => b.games - a.games);

            //add first 4 to player list
            for (let i = 0; i < 4; i++) {

                //set their wr number in order of games played 
                wrList[i].pos = "WR " +  Number(i+1);
                playerList.push(wrList[i]);
            }
        }
    });

    playerList.sort(compareByPosition);

    for (let i = 0; i < playerList.length; i++) {
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card');

        //change data to string
        let oldData = playerList[i].data.toString();
        //replace string and assign to data
        playerList[i].data = oldData.replace(/WR/g, playerList[i].pos);

        playerCard.innerHTML = playerList[i].data;
        playerCardsContainer.appendChild(playerCard);
    }
  }

  function populateSchedule(data) {
    const scheduleListElement = document.getElementById('schedule-panel');
  
    const lineContainer = document.createElement('div');

    lineContainer.classList.add('align-container', 'clearfix');

    //Clear any existing content in the list
    scheduleListElement.innerHTML = '';
    let videoCount = 0;
    //Iterate through the array and create list items
    data.schedule.body.schedule.forEach(item => {
        //if the game is part of the regular season
        if (item.seasonType === "Regular Season") {
            const listItem = document.createElement('div');

            let gameResultText;

            if (item.gameStatus === "Completed") {
                //check which team is the loser
                let losingTeamAbbr = (item.awayPts > item.homePts) ? item.home : item.away;
                let winningTeamAbbr = (item.awayPts < item.homePts) ? item.home : item.away;

                //idk why i need to hardcode this apparently 7 is more than 30
                if (item.home === "PIT") {
                    losingTeamAbbr = "PIT";
                    winningTeamAbbr = "SF";
                }

                gameResultText = "<div style='text-align: left; width: 100px; line-height: 1.3; '>" + item.away + "<br>" + "@<br>" + item.home + "</div>" +
                "<div style='text-align: right; width: 100px; line-height: 1.3; '>" + item.awayPts + "<br><br>" + item.homePts + "</div>";

                //create a span for the losing team's abbr
                const losingTeamAbbrSpan = document.createElement('span');
                losingTeamAbbrSpan.textContent = losingTeamAbbr;
                losingTeamAbbrSpan.style.color = 'gray'; //change losing color to gray

                const winningTeamAbbrSpan = document.createElement('span');
                winningTeamAbbrSpan.textContent = losingTeamAbbr;
                winningTeamAbbrSpan.style.color = 'green'; //change losing color to gray

                //create a span for the losing team's abbr
                const awayPts = document.createElement('span');
                awayPts.textContent = item.awayPts;

                //replace the losing team's abbr in the gameResultText with the colored span
                gameResultText = gameResultText.replace(losingTeamAbbr, losingTeamAbbrSpan.outerHTML);
            }
            else {
                //format the date
                const dateStr = item.gameDate;
                const month = dateStr.substring(4, 6);
                const day = dateStr.substring(6, 8);
                const formattedDate = `${month}/${day}`;

                gameResultText = item.away + " @ " + item.home + " (" + formattedDate + ", " + item.gameTime + ")";
            }

            listItem.innerHTML = gameResultText;

            listItem.classList.add('list-item');            
            
            var link = populateGameMedia(data, item, videoCount);

            // Append the link to the container
            scheduleListElement.appendChild(link);
            listItem.classList.add('list-item');
            scheduleListElement.appendChild(listItem);

        }
    });
  }

function toggleBackups(position, data) {
    const backups = getBackupsForPosition(position, data);
  
    const backupsContainer = document.querySelector(`#${position} .backups`);
  
    if (backupsContainer) {
      // Clear existing backups
      backupsContainer.innerHTML = '';
  
      // Add the new backups
      backups.forEach(backup => {
        const backupElement = document.createElement('p');
        backupElement.textContent = `Backup: ${backup}`;
        backupsContainer.appendChild(backupElement);
      });
    }
  }
  
  // Function to get backups for a position (replace this with your data retrieval logic)
  function getBackupsForPosition(position) {
    // Replace this with your data retrieval logic
    const backups = [
      'Player 2',
      'Player 3',
      'Player 4'
    ];
  
    return backups;
  }