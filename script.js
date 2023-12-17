console.log('Before Axios request');

const options = {
  method: 'GET',
  url: 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeamSchedule',
  params: {
    teamAbv: 'SF',
    season: '2023'
  },
  headers: {
    'X-RapidAPI-Key': '79cdf0afd7msh13d8036a4e55a82p1ffebdjsn241c6dbb1893',
    'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
  }
};

try {
    const response = await axios(options);  // Use axios instead of request
    console.log(response.data); //log the response

    const data = response.data;

    const scheduleListElement = document.getElementById('schedule-panel');

    //Clear any existing content in the list
    scheduleListElement.innerHTML = '';

    //Assuming 'scoringPlays' is an array in the response
    if (Array.isArray(data.body.schedule)) {
        //Iterate through the array and create list items
        data.body.schedule.forEach(item => {
            //if the game is part of the regular season
            if (item.seasonType == "Regular Season") {
                const listItem = document.createElement('div');

                let gameResultText;

                if (item.gameStatus == "Completed") {
                    //check which team is the loser
                    let losingTeamAbbr = (item.awayPts > item.homePts) ? item.home : item.away;

                    //idk why i need to hardcode this apparently 7 is more than 30
                    if (item.home == "PIT") {
                        losingTeamAbbr = "PIT";
                    }

                    gameResultText = item.away + " " + item.awayPts +
                    "<br> @ <br>" + item.home + " " + item.homePts;

                    //create a span for the losing team's abbr
                    const losingTeamAbbrSpan = document.createElement('span');
                    losingTeamAbbrSpan.textContent = losingTeamAbbr;
                    losingTeamAbbrSpan.style.color = 'gray'; //change losing color to gray

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
                scheduleListElement.appendChild(listItem);
            }
        });
    }


} catch (error) {
    console.error(error);
}
