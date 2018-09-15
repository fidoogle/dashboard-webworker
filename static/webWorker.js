let ACTIVITIES;
let AREAS;
let BDS;
let STAGES;
let STATUSES;
let ACTIVITY_PERCENTS;

onmessage = function(e) {
  ACTIVITIES = e.data[0];
  AREAS = e.data[1];
  BDS = e.data[2];
  STAGES = e.data[3];
  STATUSES = e.data[4];

  ACTIVITY_PERCENTS = activityPercents();

  postMessage([ACTIVITY_PERCENTS, bizDeliverablePercents(), stagePercents()]);
};

function filterBizDeliverables(areaID) {
  let filterByArea = BDS;
  if (areaID == 2018) {
    //TODO: careful with strings, may need to parseInt
    filterByArea = BDS.filter(item => {
      return item.Iteration_Year == areaID;
    });
  } else if (areaID != -1) {
    filterByArea = BDS.filter(item => {
      return item.Tag_x0020_lookupId == areaID;
    });
  }
  return filterByArea;
}

function activityPercents() {
  let activitiesByStage;
  let bizID;
  let notstarted = 0;
  let scheduled = 0;
  let inprogress = 0;
  let impediment = 0;
  let completed = 0;
  let percents = [];
  let deliverablesFiltered;
  let statusesFiltered;

  for (let r = 0; r < AREAS.length; r++) {
    deliverablesFiltered = filterBizDeliverables(AREAS[r].ID);

    for (let s = 0; s < STAGES.length; s++) {
      activitiesByStage = ACTIVITIES.filter(item => {
        return item.Stage.ID == STAGES[s].ID;
      });

      for (let a = 0; a < activitiesByStage.length; a++) {
        notstarted = 0;
        scheduled = 0;
        inprogress = 0;
        impediment = 0;
        completed = 0;

        for (let b = 0; b < deliverablesFiltered.length; b++) {
          bizID = deliverablesFiltered[b].ID;
          statusesFiltered = STATUSES.filter(item => {
            return (
              item.Activity.ID === activitiesByStage[a].ID &&
              item.BD.ID === bizID
            );
          });
          if (statusesFiltered.length !== 0) {
            if (statusesFiltered[0].Status === "Scheduled") {
              scheduled++;
            } else if (statusesFiltered[0].Status === "In progress") {
              inprogress++;
            } else if (statusesFiltered[0].Status === "Impediment") {
              impediment++;
            } else if (statusesFiltered[0].Status === "Complete") {
              completed++;
            } else {
              notstarted++;
            }
          }
        }

        if (deliverablesFiltered.length) {
          percents.push({
            areaID: AREAS[r].ID,
            activityID: activitiesByStage[a].ID,
            percent:
              Math.round((100 * completed) / deliverablesFiltered.length) + "%",
            stageID: STAGES[s].ID,
            notstarted,
            scheduled,
            inprogress,
            impediment,
            completed
          });
        } else {
          percents.push({
            areaID: AREAS[r].ID,
            activityID: activitiesByStage[a].ID,
            percent: "0%",
            stageID: STAGES[s].ID,
            notstarted,
            scheduled,
            inprogress,
            impediment,
            completed
          });
        }
      }
    }
  }
  //console.log('activityPercents:',percents);
  return percents;
}

function bizDeliverablePercents() {
  let activitiesByStage;
  let bizID;
  let completed = 0;
  let percents = [];
  let statusesCompleted;
  let deliverablesFiltered;

  for (let r = 0; r < AREAS.length; r++) {
    deliverablesFiltered = filterBizDeliverables(AREAS[r].ID);

    for (let s = 0; s < STAGES.length; s++) {
      activitiesByStage = ACTIVITIES.filter(item => {
        return item.Stage.ID == STAGES[s].ID;
      });

      for (let b = 0; b < deliverablesFiltered.length; b++) {
        completed = 0;

        for (let a = 0; a < activitiesByStage.length; a++) {
          bizID = deliverablesFiltered[b].ID;
          statusesCompleted = STATUSES.filter(item => {
            return (
              item.Activity.ID === activitiesByStage[a].ID &&
              item.BD.ID === bizID &&
              item.Status === "Complete"
            );
          });
          completed += statusesCompleted.length;
        }

        if (activitiesByStage.length) {
          percents.push({
            areaID: AREAS[r].ID,
            bizID: bizID,
            completed,
            activities: activitiesByStage.length,
            percent:
              Math.round((100 * completed) / activitiesByStage.length) + "%",
            stageID: STAGES[s].ID
          });
        } else {
          percents.push({
            areaID: AREAS[r].ID,
            bizID: bizID,
            percent: "0%",
            stageID: STAGES[s].ID
          });
        }
      }
    }
  }
  //console.log('percentsBD:',percents);
  return percents;
}

function stagePercents() {
  let percents = [];
  let activitiesByAreaStage = [];
  let sum = 0;
  let notstarted = 0;
  let scheduled = 0;
  let inprogress = 0;
  let impediment = 0;
  let completed = 0;

  for (let r = 0; r < AREAS.length; r++) {
    for (let s = 0; s < STAGES.length; s++) {
      activitiesByAreaStage = ACTIVITY_PERCENTS.filter(item => {
        return item.areaID == AREAS[r].ID && item.stageID == STAGES[s].ID;
      });

      if (activitiesByAreaStage.length === 0) {
        percents.push({
          areaID: AREAS[r].ID,
          percent: "0%",
          stageID: STAGES[s].ID,
          notstarted: 0,
          scheduled: 0,
          inprogress: 0,
          impediment: 0,
          completed: 0
        });
      } else {
        sum = 0;
        notstarted = 0;
        scheduled = 0;
        inprogress = 0;
        impediment = 0;
        completed = 0;

        for (let a = 0; a < activitiesByAreaStage.length; a++) {
          if (parseInt(activitiesByAreaStage[a].percent.slice(0, -1), 10)) {
            //remove % at end and convert to int
            sum += parseInt(activitiesByAreaStage[a].percent.slice(0, -1), 10);
          }

          notstarted += activitiesByAreaStage[a].notstarted;
          scheduled += activitiesByAreaStage[a].scheduled;
          inprogress += activitiesByAreaStage[a].inprogress;
          impediment += activitiesByAreaStage[a].impediment;
          completed += activitiesByAreaStage[a].completed;
        }

        percents.push({
          areaID: AREAS[r].ID,
          percent: Math.round(sum / activitiesByAreaStage.length) + "%",
          stageID: STAGES[s].ID,
          notstarted,
          scheduled,
          inprogress,
          impediment,
          completed
        });
      }
    }
  }
  //console.log('Stagepercents:',percents);
  return percents;
}
