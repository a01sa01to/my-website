import json
import csv
import os

json_list = {
  "patients": {"lastUpdate":"","size":""},
  "test_people": {"lastUpdate":"","size":""},
  "call_center": {"lastUpdate":"","size":""},
  "positive_number": {"lastUpdate":"","size":""},
  "recovered_number": {"lastUpdate":"","size":""},
  "death_number": {"lastUpdate":"","size":""},
  "inspections_summary": {"lastUpdate":"","size":""},
  "main_summary": {"lastUpdate":"","size":""},
  "corona_next": {"lastUpdate":"","size":""},
}

FILELIST = [
  "080004_ibaraki_covid19_patients.csv",
  "080004_ibaraki_covid19_test_people.csv",
  "080004_ibaraki_covid19_call_center.csv",
  "080004_ibaraki_covid19_positive_number.csv",
  "080004_ibaraki_covid19_recovered_number.csv",
  "080004_ibaraki_covid19_death_number.csv",
  "080004_ibaraki_covid19_inspections_summary.json",
  "080004_ibaraki_covid19_summary.json",
  "080004_ibaraki_covid19_corona_next.json",
]

ALIASLIST = {
  "080004_ibaraki_covid19_patients.csv": "patients",
  "080004_ibaraki_covid19_test_people.csv": "test_people",
  "080004_ibaraki_covid19_call_center.csv": "call_center",
  "080004_ibaraki_covid19_positive_number.csv": "positive_number",
  "080004_ibaraki_covid19_recovered_number.csv": "recovered_number",
  "080004_ibaraki_covid19_death_number.csv": "death_number",
  "080004_ibaraki_covid19_inspections_summary.json": "inspections_summary",
  "080004_ibaraki_covid19_summary.json": "main_summary",
  "080004_ibaraki_covid19_corona_next.json": "corona_next",
}

jsonname = "covid19_ibaraki"
SIZEUNIT = ["Byte", "KB", "MB", "GB", "TB", "PB", "EiB", "ZB", "YB"]

with open("last_update.json", "r", encoding="UTF-8") as f:
  lastUpdate = json.load(f)

for filename in FILELIST:
  aliasname = ALIASLIST[filename]
  filesize = os.path.getsize(filename)
  for i in range(len(SIZEUNIT)):
    if(filesize / 1024 < 1):
      filesize = "{} {}".format(round(filesize,2), SIZEUNIT[i])
      break
    else:
      filesize /= 1024

  json_list[aliasname]["lastUpdate"] = lastUpdate[aliasname]
  json_list[aliasname]["size"] = filesize


with open("../../_data/{}.json".format(jsonname), "w", encoding="UTF-8") as f:
  json.dump(json_list, f, ensure_ascii=False, indent=2, separators=(",", ": "))
