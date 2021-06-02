import json
import os

json_list = {
  "patients": {"lastUpdate":"","size":""},
  "test_people": {"lastUpdate":"","size":""},
  "mutant_test_people": {"lastUpdate":"","size":""},
  "call_center": {"lastUpdate":"","size":""},
  "positive_number": {"lastUpdate":"","size":""},
  "mutant_positive_number": {"lastUpdate":"","size":""},
  "recovered_number": {"lastUpdate":"","size":""},
  "death_number": {"lastUpdate":"","size":""},
  "death_attr": {"lastUpdate":"","size":""},
  "inspections_summary": {"lastUpdate":"","size":""},
  "main_summary": {"lastUpdate":"","size":""},
  "corona_next": {"lastUpdate":"","size":""},
  "roller_mito": {"lastUpdate":"2020/08/21 23:59","size":"1.10 KB"},
  "roller_tsukuba_amakubo": {"lastUpdate":"2020/09/07 23:59","size":"1.02 KB"},
  "roller_tsuchiura_sakura": {"lastUpdate":"2020/11/28 23:59","size":"1.38 KB"},
}

FILELIST = [
  "080004_ibaraki_covid19_patients.csv",
  "080004_ibaraki_covid19_test_people.csv",
  "080004_ibaraki_covid19_mutant_test_people.csv",
  "080004_ibaraki_covid19_call_center.csv",
  "080004_ibaraki_covid19_positive_number.csv",
  "080004_ibaraki_covid19_recovered_number.csv",
  "080004_ibaraki_covid19_death_number.csv",
  "080004_ibaraki_covid19_inspections_summary.json",
  "080004_ibaraki_covid19_summary.json",
  "080004_ibaraki_covid19_corona_next.json",
  "080004_ibaraki_covid19_death_attributes.csv",
  "080004_ibaraki_covid19_mutant_positive_number.json"
]

ALIASLIST = {
  "080004_ibaraki_covid19_patients.csv": "patients",
  "080004_ibaraki_covid19_test_people.csv": "test_people",
  "080004_ibaraki_covid19_mutant_test_people.csv": "mutant_test_people",
  "080004_ibaraki_covid19_call_center.csv": "call_center",
  "080004_ibaraki_covid19_positive_number.csv": "positive_number",
  "080004_ibaraki_covid19_recovered_number.csv": "recovered_number",
  "080004_ibaraki_covid19_death_number.csv": "death_number",
  "080004_ibaraki_covid19_inspections_summary.json": "inspections_summary",
  "080004_ibaraki_covid19_summary.json": "main_summary",
  "080004_ibaraki_covid19_corona_next.json": "corona_next",
  "080004_ibaraki_covid19_death_attributes.csv": "death_attr",
  "080004_ibaraki_covid19_mutant_positive_number.json": "mutant_positive_number",
}

SIZEUNIT = ["Byte", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]

with open("last_update.json", "r", encoding="UTF-8") as f:
  lastUpdate = json.load(f)
  lastUpdate["mutant_positive_number"] = lastUpdate["mutant_positive"]
  del lastUpdate["mutant_positive"]

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

  if ".json" in filename:
    with open(filename, "r", encoding="UTF-8") as f:
      json_base = json.load(f)
    with open(filename, "w", encoding="UTF-8") as f:
      json.dump(json_base, f, ensure_ascii=False, indent=2, separators=(",", ": "))


with open("../../../_data/covid19_ibaraki.json", "w", encoding="UTF-8") as f:
  json.dump(json_list, f, ensure_ascii=False, indent=2, separators=(",", ": "))
