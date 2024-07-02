let verticalAnalyticsChartsBottom = document.querySelector(
    ".vertical-analytics-charts .bottom"
);
let verticalAnalyticsChartsTopLeft = document.querySelector(
    ".vertical-analytics-charts .top .left"
);
let verticalAnalyticsChartsTopRight = document.querySelector(
    ".vertical-analytics-charts .top .right"
);

// get activities types
let activitiesTypes = [];
activities.forEach((activity) => {
    console.log(activity);
    let typeId = activity.typies.id;
    // check if type is added
    let added = activitiesTypes.find((type) => type.id === typeId);
    // if not added add it
    if (!added) activitiesTypes.push(activity.typies);
});

// get max activities count based on type
let maxCount = 0;
activitiesTypes.forEach((type) => {
    // get how many activities made on this type
    let typeCount = 0;
    activities.forEach((activity) => {
        if (activity.typies.id === type.id) typeCount += 1;
    });
    // get max type count
    if (maxCount < typeCount) maxCount = typeCount;
});
// get max type count
activitiesTypes.forEach((type, index) => {
    let typeCount = 0;
    //  get activities count made for this type
    activities.forEach((activity) => {
        if (activity.typies.id === type.id) typeCount += 1;
    });
    //  put every activity type in bottom of analytics chart
    verticalAnalyticsChartsBottom.innerHTML += `
  <p class="activity-bar">${type.name_ar}</p>
  `;
    //  put every activity type vertical ber (and get height dynamically by activities created count for this type)
    verticalAnalyticsChartsTopRight.innerHTML += `
  <div data-height="${(100 / maxCount) * typeCount}%" style="left: ${
        (100 / activitiesTypes.length) * index
    }%" class="column vertical-chart-column">
    <span class="details">عدد الانشطة ${typeCount}</span>
  </div>
    `;
});

// using settimeout to make it animate
setTimeout(() => {
    let allVerticalCharts = document.querySelectorAll(".vertical-chart-column");
    allVerticalCharts.forEach((chart) => {
        // get height of vertical bar dynamically based on activities count made for this type
        chart.classList.add("show");
        chart.style.height = chart.getAttribute("data-height");
    });
}, 10);

// put count row in left side with count and right side with tiny bar
function putRow(number) {
    verticalAnalyticsChartsTopLeft.innerHTML += `
    <p class="count-row">${number}</p>
    `;
    verticalAnalyticsChartsTopRight.innerHTML += `
    <div class="row"></div>
    `;
}
// on left side decide showing count dynamically based on max count (to prevent showing too many counts when max count is very big)
let showEvery = maxCount >= 8 ? Math.floor(maxCount / 8) : 1;
// on left side decide showing count dynamically based on max count (to prevent showing too many counts when max count is very big)
for (let i = showEvery; i <= maxCount; ) {
    putRow(i);

    // when biggest count not showing show it
    if (showEvery + i > maxCount && maxCount > 16 && i !== maxCount)
        putRow(maxCount);
    i += showEvery;
}
