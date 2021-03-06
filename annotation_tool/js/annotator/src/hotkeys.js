function preventOverlapsOnArrow(current_region, inc=0.0) {
  var new_start, new_end,
    current_id = current_region.id;
  if (inc > 0.0) {
    new_start = current_region.start;
    new_end = current_region.end + inc;
    if (new_end > handler.getWavesurfer().getDuration() - getPadding()) {
      new_end = handler.getWavesurfer().getDuration() - getPadding();
    }
  } else if (inc < 0.0) {
    new_start = current_region.start + inc;
    if (new_start < getPadding()) {
      new_start = getPadding();
    }
    new_end = current_region.end
  }
  if (!ALLOW_OVERLAPS) {
    var wavesurfer = handler.getWavesurfer();
    Object.keys(wavesurfer.regions.list).forEach(function (id) {
      if (current_id == id) {
        return;
      }
      var region = wavesurfer.regions.list[id];
      if (new_start < region.start && new_end > region.start) {
        new_end = region.start
      } else if (new_start < region.end && new_end > region.end) {
        new_start = region.end
      }
    });
  }

  return [new_start, new_end]
}

function sortRegionsByOption(regions, option) {
  var region_list = [];
  Object.keys(regions).forEach(function (id) {
    region_list.push(regions[id]);
  });
  region_list.sort(function (a, b) {
    return a[option] - b[option];
  });

  return region_list
}

// glue the selected region limits to the closer borders
function glueSelectedRegionLimits(region, pressCtrl, pressShift, overlaps) {
  var wavesurfer = handler.getWavesurfer(),
    region_list = sortRegionsByOption(wavesurfer.regions.list, "start"),
    new_start, new_end;
  if (!overlaps) {
    for (var i = 0; i < region_list.length; i++) {
      if (region == region_list[i]) {
        if (i == 0) {
          if (!pressShift) {
            new_start = getPadding();
          }
          if (region_list.length == 1) {
            if (pressCtrl == pressShift) {
              new_end = handler.getWavesurfer().getDuration() - getPadding();
            }
          } else {
            if (pressCtrl == pressShift) {
              new_end = region_list[i + 1].start
            }
          }
        } else if (i == region_list.length - 1) {
          if (!pressShift) {
            new_start = region_list[i - 1].end
          }
          if (pressShift == pressCtrl) {
            new_end = handler.getWavesurfer().getDuration() - getPadding();
          }
        } else {
          if (!pressShift) {
            new_start = region_list[i - 1].end
          }
          if (pressShift == pressCtrl) {
            new_end = region_list[i + 1].start
          }
        }
        region.update({
          start: new_start,
          end: new_end
        });
        updateEvent(region);
        break;
      }
    }
  } else {
    for (var i = 0; i < region_list.length; i++) {
      if (region == region_list[i]) {
        if (!pressShift) {
          new_start = getPadding();
        }
        if (pressCtrl == pressShift) {
          new_end = handler.getWavesurfer().getDuration() - getPadding();
        }
        region.update({
          start: new_start,
          end: new_end
        });
        updateEvent(region);
        break;
      }
    }
  }
}

function setClassForRegion(region, class_name, color) {
  region.update({
    attributes: {
      'class': class_name,
      'tags': region.attributes['tags'],
      'event_id': region.attributes['event_id']
    },
    color: color,
    annotation: class_name
  });
  updateEvent(region);
  redrawClassForRegion(region);
}

// HTML elements callbacks
document.onkeydown = function (e) {
  if (e.target == $('#tags-input-tokenfield')[0]) {
    return;
  }
  e.stopPropagation();
  e.preventDefault();

  var region = handler.findRegionById(currentRegionId),
    key = e.key,
    wavesurfer = handler.getWavesurfer(),
    n_regions = wavesurfer ? Object.keys(wavesurfer.regions.list).length : 0,
    pressCtrl = e.ctrlKey == true,
    pressShift = e.shiftKey == true,
    isNotPlayerKey = ' sb'.indexOf(key) == -1,
    times;

  if ((REGIONS_STATE || currentRegionId == -1) && isNotPlayerKey) {
    return;
  }

  // set class for region
  for (var i = 0; i < CLASS_DICT.length; i++) {
    if (CLASS_DICT[i][2] == key && !pressCtrl) {
      setClassForRegion(region, CLASS_DICT[i][0], CLASS_DICT[i][1])
    }
  }

  if (key == " ") {
    handler.playPause();
  } else if (key == "ArrowLeft" && pressCtrl && !pressShift) {
    times = preventOverlapsOnArrow(region, increment = -1. / 100)
    region.update({start: times[0]});
  } else if (key == "ArrowRight" && pressCtrl && !pressShift) {
    region.update({start: region.start + 1. / 100});
  } else if (key == "ArrowLeft" && pressCtrl && pressShift) {
    region.update({end: region.end - 1. / 100});
  } else if (key == "ArrowRight" && pressCtrl && pressShift) {
    times = preventOverlapsOnArrow(region, increment = 1. / 100)
    region.update({end: times[1]});
  } else if (key == 'b' && region != null) {
    handler.seekTo(region.start / handler.getWavesurfer().getDuration());
  } else if (key == 's') {
    handler.seekTo(0.0);
  } else if (key == 'f' || key == 'F') {
    glueSelectedRegionLimits(region, pressCtrl, pressShift, ALLOW_OVERLAPS);
  }
  if (ALLOW_OVERLAPS) {
    checkOverlaps();
  }
}

document.onkeyup = function (e) {
  var key = e.key;
  var wavesurfer = handler.getWavesurfer();
  if (key == "ArrowLeft" || key == "ArrowRight") {
    if (currentRegionId != -1) {
      region = wavesurfer.regions.list[currentRegionId];
      updateEvent(region);
    }
  }
}