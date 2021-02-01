import React, { Component } from "react";
import $ from "jquery";
import Footer from "../../commons/footer/Footer";
import { NotificationManager } from "react-notifications";
import ModernDatepicker from "react-modern-datepicker";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import _ from "lodash";
import moment from "moment";
import Excel from "exceljs";
import FileSaver from "file-saver";

import LoginActions from "../../actions/LoginActions";
import Auth from "../../services/AuthService";
import LoginHelper from "../../helpers/LoginHelper";

class TMSTab extends Component {
  constructor(props) {
    super(props);
    this.role = localStorage.getItem("role");
    this.userName = localStorage.getItem("userName");
    this.userId = localStorage.getItem("userId");
    this.currentMonth = ("0" + (new Date().getUTCMonth() + 1)).slice(-2);
    this.currentYear = new Date().getFullYear();
    this.state = {
      employees: [],
      load: false,
      users: [],
      startDate: this.currentMonth + "/" + this.currentYear, // can be any of these ['dayjs()', '', null, new Date(2018,12,1)]
      isActive: false
    };

    this.saveData = this.saveData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleSearch(ev) {
    this.setState({
      isActive: true
    });
    if (this.role === "Project Manager") {
      if (this.state.selectValue && this.state.startDate) {
        let searchData = {
          searchDate: this.state.startDate,
          userId: this.state.selectValue,
          selectOption: this.state.selectOption
        };
        this.initDatagrid(searchData);
      } else {
        NotificationManager.error(
          "Employee Name & Date is required",
          "Error",
          2000
        );
      }
    } else {
      this.initDatagrid(this.state.startDate);
    }
  }

  componentWillMount() {
    this.setState({
      isActive: true
    });
    this.initDatagrid();
  }

  calculateLeavesAndHolidays() {
    let leaves = 0;
    let holidays = 0;

    let leave_or_holidays = $(".custom-radio input[type='radio']:checked");
    const holiday_pattern = new RegExp("holiday");
    const leave_pattern = new RegExp("leave");

    for (let index = 0; index < leave_or_holidays.length; index++) {
      let leave_or_holiday = leave_or_holidays[index];

      if (leave_pattern.test($(leave_or_holiday).attr("id"))) {
        leaves = leaves + 1;
      }

      if (holiday_pattern.test($(leave_or_holiday).attr("id"))) {
        holidays = holidays + 1;
      }
    }

    $(".holidays").html("Holidays :- <span>" + holidays + "</span>");
    $(".leaves").html("Leaves :- <span>" + leaves + "</span>");
  }

  initDatagrid(date) {
    var self = this;

    $(window)
      .on("load resize ", function() {
        var scrollWidth =
          $(".tbl-content").width() - $(".tbl-content table").width();

        $(".tbl-header").css({ "padding-right": scrollWidth });
      })
      .resize();

    let inputMonth = ("0" + (new Date().getUTCMonth() + 1)).slice(-2);
    let inputYear = new Date().getFullYear();
    let userId = self.userId;
    let selectOption = null;

    if (date) {
      if (date.searchDate) {
        userId = date.userId !== "none" ? date.userId : self.userId;
        inputMonth = date.searchDate.split("/")[0];
        inputYear = date.searchDate.split("/")[1];
        selectOption = date.selectOption === "Self" ? null : date.selectOption;
      } else {
        inputMonth = date.split("/")[0];
        inputYear = date.split("/")[1];
      }
    }

    Auth.getData(userId, inputMonth + "/" + inputYear).then(result => {
      let totalTime;
      let monthDates = {};
      let resDates = {};
      for (let index = 1; index <= 31; index++) {
        const selectedDate = new Date(
          inputYear + "-" + inputMonth + "-" + index
        );
        if (("0" + (selectedDate.getMonth() + 1)).slice(-2) === inputMonth) {
          monthDates[selectedDate.getDate()] = {
            day: selectedDate.getDate(),
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
            date:
              selectedDate.getDate() +
              "/" +
              (selectedDate.getMonth() + 1) +
              "/" +
              selectedDate.getFullYear(),
            project: "Built",
            description:
              selectedDate.getDay() === 6
                ? "Saturday"
                : selectedDate.getDay() === 0
                ? "Sunday"
                : "",
            actualTime: "",
            overTime: 0
          };
        } else {
          break;
        }
      }

      // Manupulate data with the dates.
      $.each(result, function(key, item) {
        Object.keys(monthDates).forEach(clientDate => {
          if (clientDate.split("/")[0] == item["day"]) {
            resDates[clientDate] = {
              day: item.day,
              month: item.month,
              year: item.year,
              date: item.day + "/" + item.month + "/" + item.year,
              project: item.project,
              description: item.description,
              actualTime: item.actualTime,
              overTime: item.overTime,
              leave: item.leave,
              holiday: item.holiday
            };
          }
        });
      });

      // clearing the doms
      $("#tms-grid").html("");

      if (Object.keys(resDates).length === 0) {
        resDates = monthDates;
      }
      // const computedData = Object.assign(monthDates, resDates);

      resDates = _.sortBy(resDates, ["day"]);

      $.each(resDates, function(index, datesObj) {
        let weekend = false;
        const day = datesObj.description === "Saturday" ? "Saturday" : "Sunday";

        if (
          datesObj.description !== "Saturday" &&
          datesObj.description !== "Sunday"
        ) {
          weekend = true;
        }

        totalTime =
          parseInt(datesObj.actualTime || 0) + parseInt(datesObj.overTime);

        const dateCol = "<td>" + datesObj.date + "</td>";

        const date = datesObj.date
          .split("/")
          .map(dt => dt.padStart(2, "0"))
          .join("");
        const leavesAttr = "leave" + date;
        const holidaysAttr = "holiday" + date;
        const noneAttr = "none" + date;
        const customRadioAttr = "customRadio" + date;
        const weekendCell = weekend
          ? `<tr class="tms-table-row" id="row-${date}">`
          : `<tr class="tms-table-row tms-weekend" id="row-${date}">`;

        const isLeave = datesObj.leave;
        const isHoliday = datesObj.holiday;
        const disabledClass = isLeave || isHoliday ? "disabled" : "";

        const leavesHolidays = weekend
          ? '<td><div class="custom-radio" title="Leave"><input type="radio" id=' +
            leavesAttr +
            " name=" +
            customRadioAttr +
            ' class="custom-control-input"><label class="custom-control-label" for=' +
            leavesAttr +
            '>L</label></div><div class="custom-radio" title="Holiday"><input type="radio" id=' +
            holidaysAttr +
            " name=" +
            customRadioAttr +
            ' class="custom-control-input"><label class="custom-control-label" for=' +
            holidaysAttr +
            '>H</label></div><div class="custom-radio" title="None"><input type="radio" id=' +
            noneAttr +
            " name=" +
            customRadioAttr +
            ' class="custom-control-input" checked=""><label class="custom-control-label" for=' +
            noneAttr +
            ">N</label></div></td>"
          : "<td></td>";

        const projectCol = weekend
          ? "<td>" + datesObj.project + "</td>"
          : "<td></td>";

        const descCol = weekend
          ? selectOption === null || selectOption === "Self"
            ? `<td><textarea class="tms-textarea tms-grid-input" name="description" value='${datesObj.description}'>${datesObj.description}</textarea></td>`
            : "<td>" + datesObj.description + "</td>"
          : '<td class="description">' + day + "</td>";

        const actualTimeCol = weekend
          ? selectOption === null || selectOption === "Self"
            ? `<td><input type="number" oninput="javascript: if (this.value.length > this.maxLength) this.value = Number(this.value.slice(0, this.maxLength));" maxlength="1" class="tms-input tms-grid-input" name="actualTime" placeholder="0" value='${datesObj.actualTime}' ${disabledClass}></td>`
            : "<td>" + datesObj.actualTime + "</td>"
          : "<td></td>";

        const overTimeCol = weekend
          ? selectOption === null || selectOption === "Self"
            ? `<td><input type="number" oninput="javascript: if (this.value.length > this.maxLength) this.value = Number(this.value.slice(0, this.maxLength));" maxlength="1" class="tms-input tms-grid-input" name="overTime" value='${datesObj.overTime}' ${disabledClass}></td>`
            : "<td>" + datesObj.overTime + "</td>"
          : "<td></td>";

        const totalCol = weekend
          ? '<td class="totalTime">' + totalTime + "</td>"
          : "<td></td>";

        $("#tms-grid").append(
          weekendCell +
            dateCol +
            leavesHolidays +
            projectCol +
            descCol +
            actualTimeCol +
            overTimeCol +
            totalCol +
            "</tr>"
        );

        if (isLeave) {
          $("#" + leavesAttr).prop("checked", true);
        } else if (isHoliday) {
          $("#" + holidaysAttr).prop("checked", true);
        } else {
          $("#" + noneAttr).prop("checked", true);
        }

        if (index == resDates.length - 1) {
          self.calculateLeavesAndHolidays();
        }
      });

      $('.custom-radio input[type="radio"]').on("click", function(event) {
        $(event.target).prop("checked", true);
        let selectedRadio = $(event.target).attr("name");
        let selectedValue = $(`input[name='${selectedRadio}']:checked`).attr(
          "id"
        );
        let none = new RegExp("none");
        let rowValue = selectedValue.replace(/[^\d]/g, "");
        let $description = $("#row-" + rowValue + ' [name="description"]');
        let $actualTime = $("#row-" + rowValue + ' [name="actualTime"]');
        let $overTime = $("#row-" + rowValue + ' [name="overTime"]');

        if (!none.test(selectedValue)) {
          $description.attr("disabled", "disabled");
          $actualTime.attr("disabled", "disabled");
          $overTime.attr("disabled", "disabled");
          $actualTime.val(0);
          $overTime.val(0);
        } else {
          $description.removeAttr("disabled");
          $actualTime.removeAttr("disabled");
          $overTime.removeAttr("disabled");
        }

        self.calculateLeavesAndHolidays();
      });

      $('input[type="number"][name="actualTime"]').on("change", function(
        event
      ) {
        let value = event.currentTarget.value;

        if (value > 0) {
          event.currentTarget.removeAttribute("style");
        }
      });

      $(".tms-tfoot").html(
        '<tr class="tms-table-row">' +
          '<td colspan="4">Total Working Hours</td>' +
          "<td></td>" +
          "<td></td>" +
          '<td id="grand-total">' +
          totalTime +
          "</td>" +
          "</tr>"
      );

      self.getTotalResult();
      self.handleTimeChangeValue();

      const currentDate = new Date(inputYear, inputMonth);
      const dateSelected = currentDate.toLocaleString("default", {
        month: "long"
      });

      if (self.role === "Project Manager") {
        // self.exportFile(dateSelected, inputYear);
      }
      // hide loader
      self.setState({
        isActive: false,
        selectedDate: inputMonth + "/" + inputYear
      });

      if (
        self.state.selectOption &&
        self.state.selectOption !== "Self" &&
        self.role === "Project Manager"
      ) {
        $("table input").attr("disabled", true);
        $("#saveData").addClass("hide");
      } else {
        $("#saveData").removeClass("hide");
        self.saveData();
      }

      let today = new Date();
      if (
        inputMonth == today.getMonth() + 1 &&
        inputYear == today.getFullYear()
      ) {
        let date =
          today.getDate() +
          "/" +
          (today.getMonth() + 1) +
          "/" +
          today.getFullYear();
        let dateNum = date
          .split("/")
          .map(dt => dt.padStart(2, "0"))
          .join("");

        $(`#row-${dateNum} [name="description"]`).focus();
      }
    });
  }

  handleTimeChangeValue() {
    // handle actual time and over time changes
    $("#tms-grid").on("change", "input[type=number]", function() {
      let row = $(this).closest("tr");
      let total = 0;
      let calculated_total_sum = 0;

      $("input[type=number]", row).each(function() {
        total += Number($(this).val());
      });

      $(".totalTime", row).text(total);

      $("#tms-grid .totalTime").each(function() {
        let get_textbox_value = $(this)
          .text()
          .replace(/[^0-9]/g, "");

        if ($.isNumeric(get_textbox_value)) {
          calculated_total_sum += parseFloat(get_textbox_value);
        }
      });
      $("#grand-total").html(calculated_total_sum);
    });
  }

  // get the total computed count of the total time.
  getTotalResult() {
    let total = 0;
    let $dataRows = $("#tms-grid tr");

    $dataRows.each(function() {
      $(this)
        .find("td.totalTime")
        .each(function(i) {
          total += parseInt($(this).html());
        });
    });
    $("#grand-total").text(total);
  }

  // Save timesheet data to the database table
  saveData() {
    let _this = this;
    let data = [];
    let $dataRows = $("#tms-grid tr");

    $("#saveData").unbind("click");

    $("#saveData").click(function(e) {
      $(e.currentTarget).attr("disabled", true);
      data = [];

      $dataRows.each(function() {
        let currentRow = $(this);

        let col_date = currentRow.find("td:eq(0)").text();

        const formatted_date = col_date
          .split("/")
          .map(dt => dt.padStart(2, "0"))
          .join("");
        let col_leave = $("#leave" + formatted_date).is(":checked") ? 1 : 0;
        let col_holiday = $("#holiday" + formatted_date).is(":checked") ? 1 : 0;

        let col_project = currentRow.find("td:eq(2)").text();

        let col_des = currentRow.find("td:eq(3) textarea").val()
          ? currentRow.find("td:eq(3) textarea").val()
          : currentRow.find("td:eq(3)").text();
        let col_actual_time = currentRow.find("td:eq(4) input").val()
          ? currentRow.find("td:eq(4) input").val()
          : currentRow
              .find("td:eq(4)")
              .text()
              .replace(/[^0-9]/g, "");
        let col_over_time = currentRow.find("td:eq(5) input").val()
          ? currentRow.find("td:eq(5) input").val()
          : currentRow
              .find("td:eq(5)")
              .text()
              .replace(/[^0-9]/g, "");

        let obj = {};
        obj.date = col_date;
        obj.leave = col_leave;
        obj.holiday = col_holiday;
        obj.project = col_project;
        obj.description = col_des;
        obj.actualTime = col_actual_time;
        obj.overTime = col_over_time;

        data.push(obj);
      });

      let dataObj = {
        userData: data
      };

      let failedRows = _this.validateUserData(dataObj.userData);

      $(`[name="actualTime"]`).removeAttr("style");

      if (failedRows.length > 0) {
        failedRows.forEach((row, index) => {
          let date = row
            .split("/")
            .map(dt => dt.padStart(2, "0"))
            .join("");

          if (index == 0) {
            $(`#row-${date} [name="actualTime"]`).focus();
          }
          $(`#row-${date} [name="actualTime"]`).attr(
            "style",
            "border: 1px solid red"
          );
        });

        $(e.currentTarget).removeAttr("disabled");
        return;
      }

      if (dataObj.userData) {
        Auth.postData(
          localStorage.getItem("userId"),
          _this.state.selectedDate,
          dataObj
        )
          .then(result => {
            NotificationManager.success("Saved Successfully", "Success");
            this.initDatagrid(this.state.startDate);
            $(e.currentTarget).removeAttr("disabled");
          })
          .catch(function(err) {
            $(e.currentTarget).removeAttr("disabled");
            if (err.message === "Invalid token specified") {
              NotificationManager.error(err.message, "Error", 2000);
              LoginActions.logoutUser(this);
            } else {
              const error = JSON.parse(err.response);
              NotificationManager.error(error.message, "Error", 2000);
            }
          });
      }
    });
  }

  componentDidMount() {
    let _this = this;

    $(".holidays").append($("<span>0</span>"));
    $(".leaves").append($("<span>0</span>"));

    if (this.role !== "Project Manager") {
      $(".employeeName").append($("<span>" + this.userName + "</span>"));
    } else {
      $(".employeeName").append(
        $(`<select class="custom-select" id="dropdown-item">
			<option selected disabled>Select an employee</option><option class="dropdown-item" value='none'>Self</option></select>`)
      );
      $(".custom-select").change(function(e) {
        _this.setState({
          selectValue: e.target.value,
          selectOption: e.target.selectedOptions[0].text
        });
      });

      _this.state.selectValue = LoginHelper.user.sub;

      // read employee list
      Auth.getAllEmployees().then(result => {
        this.state.employees = result;

        $.each(result, function(key, item) {
          if (
            item.role.roleName !== "Project Manager" &&
            item.role.roleName !== "Super Admin"
          ) {
            $("#dropdown-item").append(
              $(
                '<option class="dropdown-item" value=' +
                  item._id +
                  ">" +
                  item.firstName +
                  " " +
                  item.lastName +
                  "</option>"
              )
            );
          }
        });
      });
    }
  }

  validateUserData(data) {
    let failedRows = [];

    data.forEach(item => {
      let isNone = !(item["leave"] || item["holiday"]);
      let isHoliday =
        item.description === "Saturday" || item.description === "Sunday";
      let isDescription = item.description.trim().length > 0;

      if (isNone) {
        if (
          !isHoliday &&
          isDescription &&
          (item.actualTime == "" || parseInt(item.actualTime) < 1)
        ) {
          console.log(
            failedRows,
            parseInt(item.actualTime),
            item.actualTime,
            "???"
          );
          failedRows.push(item.date);
        }
      }
    });

    return failedRows;
  }

  readData() {
    let $dataRows = $("#tms-grid tr");
    let data = [];

    $dataRows.each(function() {
      let currentRow = $(this);

      let col_date = currentRow.find("td:eq(0)").text();

      const formatted_date = col_date
        .split("/")
        .map(dt => dt.padStart(2, "0"))
        .join("");
      let col_leave = $("#leave" + formatted_date).is(":checked") ? 1 : 0;
      let col_holiday = $("#holiday" + formatted_date).is(":checked") ? 1 : 0;

      let col_project = currentRow.find("td:eq(2)").text();

      let col_des = currentRow.find("td:eq(3) textarea").val()
        ? currentRow.find("td:eq(3) textarea").val()
        : currentRow.find("td:eq(3)").text();
      let col_actual_time = currentRow.find("td:eq(4) input").val()
        ? currentRow.find("td:eq(4) input").val()
        : currentRow
            .find("td:eq(4)")
            .text()
            .replace(/[^0-9]/g, "");
      let col_over_time = currentRow.find("td:eq(5) input").val()
        ? currentRow.find("td:eq(5) input").val()
        : currentRow
            .find("td:eq(5)")
            .text()
            .replace(/[^0-9]/g, "");

      let obj = {};
      obj.date = col_date;
      obj.leave = col_leave;
      obj.holiday = col_holiday;
      obj.project = col_project;
      obj.description = col_des;
      obj.actualTime = col_actual_time;
      obj.overTime = col_over_time;

      data.push(obj);
    });

    return data;
  }

  downloadMealsAllowance() {
    console.log("meals");
  }

  downloadExcel() {
    let _this = this;
    var workbook = new Excel.Workbook();

    let selectedUser = _.find(_this.state.employees, employee => {
      if (_this.state.selectValue == "none") {
        return employee._id == _this.userId;
      } else {
        return employee._id == _this.state.selectValue;
      }
    });

    let dateAttrs = _this.state.startDate.split("/");
    let requestedDate = `${dateAttrs[0]}/1/${dateAttrs[1]}`;
    let sheetDate = moment(requestedDate).format("MMM, YYYY");
    let data = _this.readData();

    workbook.creator = selectedUser.fullName
      ? selectedUser.fullName
      : selectedUser;
    workbook.created = new Date();
    workbook.modified = new Date();
    // Set workbook dates to 1904 date system
    workbook.properties.date1904 = true;

    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 1,
        visibility: "visible"
      }
    ];

    let sheet = workbook.addWorksheet(sheetDate, {
      properties: { tabColor: { argb: "FFC0000" } }
    });

    sheet.views = [{ activeCell: "A1" }];

    let startCellRow = 4;
    let startCellColumn = "C";
    let totalColumns = 5;
    let endCellColumn = getNextAlpha(startCellColumn, totalColumns);
    let startCellColumnIndex = startCellColumn.charCodeAt(0) - 65;
    let currentRow = startCellRow;
    let footerStartRow;

    let sheetWidths = [20, 20, 40, 15, 15, 15];
    for (let index = 0; index < startCellColumnIndex; index++) {
      sheetWidths.unshift(10);
    }

    sheet.columns = sheetWidths.map(function(width) {
      return {
        width: width
      };
    });

    let tableData = data.map(row => {
      let leave = row["leave"] ? "leave" : row["holiday"] ? "holiday" : "-";
      let totalTime = row["actualTime"] + row["overTime"];
      return [
        row["date"],
        leave,
        row["project"],
        row["description"],
        row["actualTime"],
        row["overTime"],
        totalTime
      ];
    });

    function getNextAlpha(alpha, step) {
      if (step == undefined) {
        step = 1;
      }

      if (step == 0) {
        return alpha;
      }

      alpha = alpha.toUpperCase();
      let alphaValue = alpha.charCodeAt(0);

      if (alphaValue - 65 == 25) {
        alphaValue = 64;
      } else if (!(alphaValue >= 65 && alphaValue < 90)) {
        throw "Only Alphabet characters are allowed";
      }

      return String.fromCharCode(alphaValue + step);
    }

    function getNextAvailableRow() {
      currentRow = currentRow + 1;
      return currentRow;
    }

    function skipNextRow(skip = 1) {
      return (currentRow = currentRow + skip);
    }

    function prepareHeader() {
      let headerCell = [
        startCellColumn + startCellRow,
        getNextAlpha(startCellColumn, 5) + startCellRow
      ];
      sheet.getCell(`${startCellColumn}:${startCellRow}`).value =
        "Tasks - planned and Actual (To be filled and updated on daily basis)";

      sheet.mergeCells(`${headerCell[0]}:${headerCell[1]}`);
    }

    function prepareName() {
      let row = getNextAvailableRow();
      sheet.getCell(`${startCellColumn}:${row}`).value = "Name -";
      sheet.getCell(`${getNextAlpha(startCellColumn)}:${row}`).value =
        selectedUser.fullName;
      sheet.mergeCells(
        `${getNextAlpha(startCellColumn)}${row}:${getNextAlpha(
          startCellColumn,
          5
        )}${row}`
      );

      row = getNextAvailableRow();
      sheet.getCell(`${startCellColumn}:${row}`).value = "Month -";
      sheet.getCell(`${getNextAlpha(startCellColumn)}:${row}`).value = moment(
        requestedDate
      ).format("MMM - YY");
      sheet.mergeCells(
        `${getNextAlpha(startCellColumn)}${row}:${getNextAlpha(
          startCellColumn,
          5
        )}${row}`
      );
    }

    function prepareTableHeader() {
      let row = getNextAvailableRow();
      sheet.getCell(`${startCellColumn}:${row}`).value = "Date";
      sheet.getCell(`${getNextAlpha(startCellColumn, 1)}:${row}`).value =
        "BD Lead/ Others activity";
      sheet.getCell(`${getNextAlpha(startCellColumn, 2)}:${row}`).value =
        "Description";
      sheet.getCell(`${getNextAlpha(startCellColumn, 3)}:${row}`).value =
        "Time";
      sheet.getCell(`${getNextAlpha(startCellColumn, 4)}:${row}`).value =
        "Over Time";
      sheet.getCell(`${getNextAlpha(startCellColumn, 5)}:${row}`).value =
        "Total Time";

      // sheet.mergeCells(`${getNextAlpha(startCellColumn)}:${row}:${endCellColumn}:${row}`);
    }

    function prepareSheetData() {
      for (let index = 0; index < data.length; index++) {
        let rowData = data[index];
        let row = getNextAvailableRow();
        let isGeneralHoliday = ["saturday", "sunday"].includes(
          rowData["description"].trim().toLowerCase()
        );
        let dayLeave =
          parseInt(rowData["actualTime"]) + parseInt(rowData["overTime"]);
        let isDayLeave = dayLeave > 0 ? 0 : 1;
        //holiday = holiday + (isGeneralHoliday ? 1 : 0);
        //leave = leave + (isGeneralHoliday ? 0 : (isDayLeave ? 1 : 0));

        sheet.getCell(`${startCellColumn}:${row}`).value = rowData["date"];
        sheet.getCell(
          `${getNextAlpha(startCellColumn, 1)}:${row}`
        ).value = isGeneralHoliday ? "" : rowData["project"];
        sheet.getCell(`${getNextAlpha(startCellColumn, 2)}:${row}`).value =
          rowData["description"];
        sheet.getCell(
          `${getNextAlpha(startCellColumn, 3)}:${row}`
        ).value = isGeneralHoliday ? "" : rowData["actualTime"];
        sheet.getCell(
          `${getNextAlpha(startCellColumn, 4)}:${row}`
        ).value = isGeneralHoliday ? "" : rowData["overTime"];
        sheet.getCell(
          `${getNextAlpha(startCellColumn, 5)}:${row}`
        ).value = isGeneralHoliday ? "" : dayLeave;

        total =
          total +
          (parseInt(rowData["actualTime"]) + parseInt(rowData["overTime"]) ||
            0);
      }
    }

    function prepareFooter() {
      let row = getNextAvailableRow();
      footerStartRow = row;

      sheet.getCell(`${getNextAlpha(startCellColumn, 2)}:${row}`).value =
        "Total Working Hours";
      sheet.getCell(`${getNextAlpha(startCellColumn, 3)}:${row}`).value =
        "Total";
      sheet.getCell(`${getNextAlpha(startCellColumn, 4)}:${row}`).value = "";
      sheet.getCell(`${getNextAlpha(startCellColumn, 5)}:${row}`).value = total;

      row = getNextAvailableRow();
      sheet.mergeCells(
        `${getNextAlpha(startCellColumn, 0)}${row}:${getNextAlpha(
          startCellColumn,
          5
        )}${row}`
      );
      row = getNextAvailableRow();

      sheet.getCell(`${getNextAlpha(startCellColumn, 3)}:${row}`).value =
        "Holiday";
      sheet.getCell(
        `${getNextAlpha(startCellColumn, 5)}:${row}`
      ).value = holiday;
      sheet.mergeCells(
        `${getNextAlpha(startCellColumn, 0)}${row}:${getNextAlpha(
          startCellColumn,
          2
        )}${row}`
      );

      row = getNextAvailableRow();

      sheet.getCell(`${getNextAlpha(startCellColumn, 3)}:${row}`).value =
        "Leave";
      sheet.getCell(`${getNextAlpha(startCellColumn, 5)}:${row}`).value = leave;
      sheet.mergeCells(
        `${getNextAlpha(startCellColumn, 0)}${row}:${getNextAlpha(
          startCellColumn,
          2
        )}${row}`
      );
    }

    function resetCursor() {
      currentRow = startCellRow;
    }

    function prepareColumnsColor(cellAddress, fillColor) {
      sheet.getCell(cellAddress).font = {
        color: { argb: "000" },
        name: "Arial",
        family: 2,
        size: 12,
        bold: true
      };
      sheet.getCell(cellAddress).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fillColor },
        bgColor: { argb: "#FF0000" }
      };
    }

    function prepareColors() {
      let row = currentRow;

      for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        for (let index = 0; index <= totalColumns; index++) {
          prepareColumnsColor(
            `${getNextAlpha(startCellColumn, index)}:${row}`,
            "ffffff"
          );
        }

        row = getNextAvailableRow();
      }

      for (let rowIndex = 0; rowIndex < 1; rowIndex++) {
        for (let index = 0; index <= totalColumns; index++) {
          prepareColumnsColor(
            `${getNextAlpha(startCellColumn, index)}:${row}`,
            "83878a"
          );
        }

        row = getNextAvailableRow();
      }

      for (
        let rowIndex = 0;
        rowIndex < footerStartRow - 4 - startCellRow;
        rowIndex++
      ) {
        for (let index = 0; index <= totalColumns; index++) {
          prepareColumnsColor(
            `${getNextAlpha(startCellColumn, index)}:${row}`,
            "ffba3c"
          );
        }

        row = getNextAvailableRow();
      }

      for (let rowIndex = 0; rowIndex < 2; rowIndex++) {
        for (let index = 0; index <= totalColumns; index++) {
          prepareColumnsColor(
            `${getNextAlpha(startCellColumn, index)}:${row}`,
            "ffffff"
          );

          if (rowIndex == 0 && index == 4) {
            sheet.mergeCells(
              `${getNextAlpha(startCellColumn, 3)}${row}:${getNextAlpha(
                startCellColumn,
                4
              )}${row}`
            );
          }
        }

        row = getNextAvailableRow();
      }

      for (let index = 3; index <= totalColumns; index++) {
        prepareColumnsColor(
          `${getNextAlpha(startCellColumn, index)}:${row}`,
          "28a745"
        );
        if (index == 4) {
          sheet.mergeCells(
            `${getNextAlpha(startCellColumn, 3)}${row}:${getNextAlpha(
              startCellColumn,
              4
            )}${row}`
          );
        }
      }

      row = getNextAvailableRow();

      for (let index = 3; index <= totalColumns; index++) {
        prepareColumnsColor(
          `${getNextAlpha(startCellColumn, index)}:${row}`,
          "dc3545"
        );
        if (index == 4) {
          sheet.mergeCells(
            `${getNextAlpha(startCellColumn, 3)}${row}:${getNextAlpha(
              startCellColumn,
              4
            )}${row}`
          );
        }
      }
    }

    function allignCells() {
      sheet.eachRow(function(Row, rowNum) {
        /** Row.alignment not work */
        // Row.alignment = { horizontal: 'left' }
        let emptyHoliday = false;
        let holidayCell = sheet.getCell(
          getNextAlpha(startCellColumn, 2) + ":" + rowNum
        );
        let holiday = holidayCell.value;
        if (holiday == "Saturday" || holiday == "Sunday") {
          emptyHoliday = true;
        }

        Row.eachCell({ includeEmpty: true }, function(Cell, cellNum) {
          /** cell.alignment not work */
          // debugger;

          if (rowNum <= startCellRow + 2) {
            Cell.alignment = {
              vertical: "middle",
              horizontal: "left"
            };
          } else if (cellNum == 2) {
            Cell.alignment = {
              vertical: "middle",
              horizontal: "left",
              wrapText: true
            };
          } else {
            Cell.alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true
            };
          }

          if (cellNum - startCellColumnIndex > 0) {
            Cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" }
            };
          }

          if (
            emptyHoliday &&
            [0, 1, 2, 3, 4, 5].includes(cellNum - startCellColumnIndex)
          ) {
            prepareColumnsColor(
              `${getNextAlpha(
                startCellColumn,
                cellNum - startCellColumnIndex
              )}:${rowNum}`,
              "ffffff"
            );
          }
        });

        if (emptyHoliday) {
          sheet.mergeCells(
            `${getNextAlpha(startCellColumn, 3)}${rowNum}:${getNextAlpha(
              startCellColumn,
              5
            )}${rowNum}`
          );
        }
      });
    }

    let total = 0;
    let holiday = 0;
    let leave = 0;

    for (let index = 0; index < data.length; index++) {
      if (data[index]["leave"]) {
        leave = leave + 1;
      }

      if (data[index]["holiday"]) {
        holiday = holiday + 1;
      }
    }

    prepareHeader();
    prepareName();
    prepareTableHeader();
    prepareSheetData();
    prepareFooter();

    resetCursor();
    prepareColors();
    allignCells();

    let fileName = "Daily Timesheet - " + selectedUser.fullName;

    workbook.xlsx
      .writeBuffer()
      .then(buffer =>
        FileSaver.saveAs(
          new Blob([buffer]),
          `${fileName.replace(/\s/, "_")}_${requestedDate}.xlsx`
        )
      )
      .catch(err => console.log("Error writing excel export", err));
  }

  render() {
    return (
      <div className="tms-content">
        <LoadingOverlay
          active={this.state.isActive}
          spinner={<Loader type="Watch" height={100} width={100} />}
        >
          <section>
            <div className="tbl-header tms-labels">
              <div className="tms-inline-display-block">
                <span>
                  Tasks - Planned and Actual (To be filled in and updated on a
                  daily basis)
                </span>
              </div>
              <div className="tms-main">
                <div className="tms-inline-display-block">
                  <span className="employeeName">
                    Employee Name :&nbsp;&nbsp;
                  </span>
                </div>
                <div className="tms-inline-display-block datepicker-block">
                  <span>
                    Date :
                    <ModernDatepicker
                      date={this.state.startDate}
                      format={`MM/YYYY`}
                      showBorder
                      className="datepicker tms-inline-display"
                      id="datepicker"
                      onChange={date => this.handleChange(date)}
                      placeholder={"Select a date"}
                    />
                  </span>
                </div>
                <div className="tms-inline-display-block">
                  <button
                    type="button"
                    id="search"
                    onClick={e => this.handleSearch(e)}
                    className="btn btn-primary"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
                <div className="tms-inline-display-block float-right tms-lhx">
                  <span className="holidays">Holidays :- </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="leaves">Leaves :- </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {this.role === "Project Manager" && (
                    <i
                      className="fa fa-download fa-2x"
                      onClick={this.downloadExcel.bind(this)}
                      title="Excel Export"
                    >
                      &nbsp;&nbsp;
                    </i>
                  )}
                  {this.role === "Project Manager" && (
                    <i
                      className="fa fa-cutlery fa-2x"
                      onClick={this.downloadMealsAllowance.bind(this)}
                      title="Meal Allowance"
                    ></i>
                  )}
                </div>
              </div>
            </div>
          </section>
          <section className="grid-section">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead className="tbl-header">
                <tr className="tms-table-header">
                  <th>Date</th>
                  <th>Leave / Holiday</th>
                  <th>Project / BD Lead / Others activity</th>
                  <th>Description</th>
                  <th>Actual Time</th>
                  <th>Over Time</th>
                  <th>Total Time</th>
                </tr>
              </thead>
              <tbody id="tms-grid" className="tbl-content"></tbody>
              <tfoot className="tms-tfoot tbl-footer"></tfoot>
            </table>
          </section>
          <section>
            <div className="action submit-button">
              <button
                type="button"
                id="saveData"
                className="btn btn-primary tms-float-rt"
              >
                Submit
              </button>
            </div>
          </section>
          <Footer />
        </LoadingOverlay>
      </div>
    );
  }
}

export default TMSTab;
