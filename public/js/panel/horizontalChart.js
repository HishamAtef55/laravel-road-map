let horizontalAnalyticsChartsTop = document.querySelector(
    ".horizontal-analytics-charts .top"
);
let horizontalAnalyticsChartsBottomLeft = document.querySelector(
    ".horizontal-analytics-charts .bottom .left"
);
let horizontalAnalyticsChartsBottomRight = document.querySelector(
    ".horizontal-analytics-charts .bottom .right"
);

let maxUsageCount = 0;
// get activities types
let activityTypes = [];
activities.forEach((activity) => {
    let typeId = activity.typies.id;
    // check if type is added
    let added = activityTypes.find((type) => type.id === typeId);
    // if not added add it
    if (!added) activityTypes.push(activity.typies);
});

activityTypes.forEach((type) => {
    let usage = 0;
    activities.forEach((activity) => {
        if (activity.typies.id !== type.id) return;
        usage += activity.usage_count;
    });
    type.usage_count = usage;
});

activityTypes.forEach((type) => {
    // get max usage count
    if (type.usage_count > maxUsageCount) maxUsageCount = type.usage_count;
});
// get max type count
activityTypes.forEach((type, index) => {
    //  put every activity type in bottom of analytics chart
    horizontalAnalyticsChartsBottomLeft.innerHTML += `
  <p class="activity-bar">${type.name_ar}</p>
  
  `;
    horizontalAnalyticsChartsBottomRight.innerHTML += `
  <div class="row"></div>
  `;
    //  put every activity type horizontal ber (and get width dynamically by activities created count for this type)
    horizontalAnalyticsChartsBottomRight.innerHTML += `
  <div data-width="${
      (100 / maxUsageCount) * type.usage_count
  }%" style="top: calc( ${
        (95 / activityTypes.length) * index
    }% + 6px)" class="activity-row horizontal-chart-column">
    <span class="details">عدد الاستخدام ${type.usage_count}</span>
  </div>
    `;
});

// using settimeout to make it animate
setTimeout(() => {
    let allhorizontalCharts = document.querySelectorAll(
        ".horizontal-chart-column"
    );
    allhorizontalCharts.forEach((chart) => {
        // get width of horizontal bar dynamically based on activities count made for this type
        chart.classList.add("show");
        chart.style.width = chart.getAttribute("data-width");
    });
}, 10);

// put count row in left side with count and right side with tiny bar
function putRow(number) {
    horizontalAnalyticsChartsTop.innerHTML += `
    <p class="count-row">${number}</p>
    `;
}
// on left side decide showing count dynamically based on max count (to prevent showing too many counts when max count is very big)
let usageShowEvery = maxUsageCount >= 8 ? Math.floor(maxUsageCount / 8) : 1;
// on left side decide showing count dynamically based on max count (to prevent showing too many counts when max count is very big)
for (let i = usageShowEvery; i <= maxUsageCount; ) {
    putRow(i);

    i += usageShowEvery;
}
