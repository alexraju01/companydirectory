// fetching
const fetchData = async (url, data = {}) => {
  try {
    const result = await new Promise((resolve, reject) => {
      $.ajax({
        url,
        type: "POST",
        dataType: "json",
        data,
        success: resolve,
        error: (_, __, errorThrown) => reject(errorThrown),
      });
    });
    // Return the result
    return result;
  } catch (error) {
    // Handle errors here
    throw error; // Re-throw the error if needed
  }
};

// Delcaring the container that needs to be used and updated
const $PersonnelRecordContainer = $("#PersonnelRecordContainer tbody");
const $departmentRecordContainer = $("#departmentRecordContainer tbody");
const $locationRecordContainer = $("#locationRecordContainer tbody");

// ############# Rending Data From Database ###################
function renderRecords(url, container, templateBlock) {
  fetchData(url).then((result) => {
    let html = result.data.map((record) => templateBlock(record)).join("");
    container.html(html);
  });
}

const personnelTemplate = (record) => `
  <tr>
      <td class="align-middle text-nowrap">${record.lastName}, ${record.firstName}</td>
      <td class="align-middle text-nowrap d-none d-md-table-cell">${record.department}</td>
      <td class="align-middle text-nowrap d-none d-md-table-cell">${record.location}</td>
      <td class="align-middle text-nowrap d-none d-md-table-cell">${record.email}</td>
      <td class="text-end text-nowrap">
      <button type="button" class="btn btn-primary btn-sm"
      data-bs-toggle="modal"
      data-bs-target="#editPersonnelModal"
      data-id="${record.id}">
      <i class="fa-solid fa-pencil fa-fw"></i>
      </button>
      <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="${record.id}">
      <i class="fa-solid fa-trash fa-fw"></i>
      </button>
      </td>
      </tr>`;

const departmentTemplate = (record) =>
  `<tr>
      <td class="align-middle text-nowrap">${record.name}</td>
      <td class="align-middle text-nowrap d-none d-md-table-cell">${record.location}</td>
      <td class="align-middle text-end text-nowrap">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#editDepartmentModal"
          data-id="${record.id}"
        >
          <i class="fa-solid fa-pencil fa-fw"></i>
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm deleteDepartmentBtn"
          data-id="${record.id}"
        >
          <i class="fa-solid fa-trash fa-fw"></i>
        </button>
      </td>
    </tr>`;

const locationTemplate = (record) => `<tr>
<td class="align-middle text-nowrap">${record.name}</td>
<td class="align-middle text-end text-nowrap">
  <button
    type="button"
    class="btn btn-primary btn-sm"
    data-bs-toggle="modal"
    data-bs-target="#editLocationModal"
    data-id="${record.id}"
  >
    <i class="fa-solid fa-pencil fa-fw"></i>
  </button>
  <button
    type="button"
    class="btn btn-primary btn-sm deleteLocationBtn"
    data-id="${record.id}"
  >
    <i class="fa-solid fa-trash fa-fw"></i>
  </button>
</td>
</tr>`;
// ##################################Displaying the records in the allocated containers ##########################################
renderRecords("libs/php/getAll.php", $PersonnelRecordContainer, personnelTemplate);
renderRecords("libs/php/getAllDepartments.php", $departmentRecordContainer, departmentTemplate);
renderRecords("libs/php/getAllLocation.php", $locationRecordContainer, locationTemplate);

function fetchDataAndRefreshRecords(url, containerId, templateFunction) {
  fetchData(url).then((result) => {
    let tbody = $(`${containerId} tbody`).empty();
    result.data.forEach((record) => tbody.append(templateFunction(record)));
  });
}

$("#refreshBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    // Refresh personnel table
    fetchDataAndRefreshRecords(
      "libs/php/getAll.php",
      "#PersonnelRecordContainer",
      personnelTemplate
    );
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      // Refresh department table
      fetchDataAndRefreshRecords(
        "libs/php/getAllDepartments.php",
        "#departmentRecordContainer",
        departmentTemplate
      );
    } else {
      // Refresh location table
      fetchDataAndRefreshRecords(
        "libs/php/getAllLocation.php",
        "#locationRecordContainer",
        locationTemplate
      );
    }
  }
});
// ################################################### Opening up The Modals for each Tab on Add button Click #######################################
$("#addBtn").click(function () {
  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
  if ($("#personnelBtn").hasClass("active")) {
    $("#addPersonnelModal").modal("show");
  }
  if ($("#departmentsBtn").hasClass("active")) {
    $("#addDepartmentModal").modal("show");
  }
  if ($("#locationsBtn").hasClass("active")) {
    $("#addLocationModal").modal("show");
  }
});
// ############################### Personnel show.bs.modal target for dropdown ###################################
$("#addPersonnelModal").on("show.bs.modal", function (e) {
  fetchData("libs/php/getAllDepartments.php").then((result) => {
    $.each(result.data, function () {
      $("#addPersonnelDepartment").append(
        $("<option>", {
          value: this.id,
          text: this.name,
        })
      );
    });
  });
});
// ############################### Department show.bs.modal target for dropdown ###################################

$("#addDepartmentModal ").on("show.bs.modal", function (e) {
  fetchData("libs/php/getAllLocation.php").then((result) => {
    $.each(result.data, function () {
      $("#addDepartmentLocation").append(
        $("<option>", {
          value: this.id,
          text: this.name,
        })
      );
    });
  });
});

// ################################ Disabling the filter option for department and location ###############################

$("#departmentsBtn").click(function () {
  $("#filterBtn").attr("disabled", true);
});

$("#locationsBtn").click(function () {
  $("#filterBtn").attr("disabled", true);
  // Call function to refresh location table
});

// ######################################### Creating Personnel Filter  ##################################################

$("#filterBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    $("#filterPersonnelModal").modal("show");
    // Fetch and populate departments
  }
});

$("#filterPersonnelModal").on("show.bs.modal", function (e) {
  fetchData("libs/php/getAllDepartments.php").then((result) => {
    // Clear existing options
    $("#filterPersonnelByDepartment").empty();
    // Add 'Get all departments' option
    $("#filterPersonnelByDepartment").append(
      $("<option>", {
        value: "all",
        text: "All Departments",
      })
    );
    // Append other options
    $.each(result.data, function () {
      $("#filterPersonnelByDepartment").append(
        $("<option>", {
          value: this.id,
          text: this.name,
        })
      );
    });
  });

  // Getting location list
  fetchData("libs/php/getAllLocation.php").then((result) => {
    // Clear existing options
    $("#filterPersonnelByLocation").empty();
    // Add 'Get all departments' option
    $("#filterPersonnelByLocation").append(
      $("<option>", {
        value: "all",
        text: "All Departments",
      })
    );
    // Append other options
    $.each(result.data, function () {
      $("#filterPersonnelByLocation").append(
        $("<option>", {
          value: this.id,
          text: this.name,
        })
      );
    });
  });
});

// Handle form submission
$("#filterPersonnelMethodForm").on("submit", function (e) {
  e.preventDefault();
  const department = $("#filterPersonnelByDepartment").val();
  const location = $("#filterPersonnelByLocation").val(); // Assuming you have a location filter as well

  // Fetch and populate personnel records based on department and location
  fetchData("libs/php/filter/filterDepartmentsAndLocation.php", {
    department: department,
    location: location,
  }).then((result) => {
    $PersonnelRecordContainer.empty();
    if (result.status === "success") {
      let html = result.data.map((record) => personnelTemplate(record)).join("");
      $PersonnelRecordContainer.html(html);
    }
  });
});

// ####################################################### Searching Through Personnel Records Table ###############################################

function updatePlaceholder() {
  if ($("#personnelBtn").hasClass("active")) {
    $("#searchInp").attr("placeholder", "Search by firstname, lastname, and email");
  }
  if ($("#departmentsBtn").hasClass("active")) {
    $("#searchInp").attr("placeholder", "Search by department name");
  }
  if ($("#locationsBtn").hasClass("active")) {
    $("#searchInp").attr("placeholder", "Search by location name");
  }
}

$("#searchInp").on("keyup", function () {
  if ($("#personnelBtn").hasClass("active")) {
    var searchLastName = this.value.toLowerCase();
    $PersonnelRecordContainer.empty();
    fetchData("libs/php/searchPersonnel.php", { searchTerm: searchLastName }).then((result) => {
      if (result.data.length > 0) {
        let html = result.data.map((record) => personnelTemplate(record)).join("");
        $PersonnelRecordContainer.html(html);
      } else {
        // If no data is returned, display a 'Not Found' message
        $PersonnelRecordContainer.html('<div class="not-found">No results found</div>');
      }
    });
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      $("#searchInp").on("keyup", function () {
        var departmentName = this.value.toLowerCase();
        $departmentRecordContainer.empty();
        fetchData("libs/php/searchDepartment.php", { departmentName }).then((result) => {
          if (result.data.length > 0) {
            let html = result.data.map((record) => departmentTemplate(record)).join("");
            $departmentRecordContainer.html(html);
          } else {
            $departmentRecordContainer.html('<div class="not-found">No results found</div>');
          }
        });
      });
    } else {
      $("#searchInp").on("keyup", function () {
        var locationName = this.value.toLowerCase();
        $locationRecordContainer.empty();
        fetchData("libs/php/searchLocation.php", { locationName }).then((result) => {
          if (result.data.length > 0) {
            let html = result.data.map((record) => locationTemplate(record)).join("");
            $locationRecordContainer.html(html);
          } else {
            $locationRecordContainer.html('<div class="not-found">No results found</div>');
          }
        });
      });
    }
  }
});
// Update the placeholder when the departments button is clicked
$("#personnelBtn").on("click", function () {
  updatePlaceholder();
});
$("#departmentsBtn").on("click", function () {
  updatePlaceholder();
});
$("#locationsBtn").on("click", function () {
  updatePlaceholder();
});

// ################### Adding records to the corresponding active tabs ##################

//  ############################## Adding a New Personnel Record ###################################################

$("#addPersonnelForm").on("submit", function (e) {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Retrieving form data
  let formData = {
    firstName: $("#addPersonnelFirstName").val(),
    lastName: $("#addPersonnelLastName").val(),
    jobTitle: $("#addPersonnelJobTitle").val(),
    email: $("#addPersonnelEmailAddress").val(),
    departmentID: $("#addPersonnelDepartment").val(),
  };

  // AJAX call to save the form data
  fetchData("libs/php/insertPersonnel.php", formData).then((result) => {
    // Refresh the personnel records after successful data insertion
    fetchDataAndRefreshRecords(
      "libs/php/getAll.php",
      "#PersonnelRecordContainer",
      personnelTemplate
    );
  });
});

//  ############################## Adding a New Department Record ###################################################

$("#addDepartmentForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour
  e.preventDefault();
  // AJAX call to save form data
  let departmentName = $("#addDepartmentName").val();
  let DepartmentLocation = $("#addDepartmentLocation").val();

  fetchData("libs/php/insertDepartment.php", {
    name: departmentName,
    locationID: DepartmentLocation,
  }).then((result) => {
    fetchDataAndRefreshRecords(
      "libs/php/getAllDepartments.php",
      "#departmentRecordContainer",
      departmentTemplate
    );
  });
});

//  ############################## Adding a New Location Record ###################################################

$("#addLocationForm").on("submit", function (e) {
  e.preventDefault();
  let locationName = $("#addLocationName").val();
  fetchData("libs/php/insertLocation.php", {
    name: locationName,
  }).then((result) => {
    fetchDataAndRefreshRecords(
      "libs/php/getAllLocation.php",
      "#locationRecordContainer",
      locationTemplate
    );
  });
});

//  ############################## Opening up personnel edit modal and autofilling ###################################################
// Cache DOM elements for efficiency
const editPersonnelModal = $("#editPersonnelModal");
const editPersonnelForm = $("#editPersonnelForm");
const editPersonnelDepartmentSelect = $("#editPersonnelDepartment");

// Function to populate the edit modal
function populateEditModal(personnelData) {
  const { id, firstName, lastName, jobTitle, email, departmentID } =
    personnelData.data.personnel[0];

  $("#editPersonnelEmployeeID").val(id);
  $("#editPersonnelFirstName").val(firstName);
  $("#editPersonnelLastName").val(lastName);
  $("#editPersonnelJobTitle").val(jobTitle);
  $("#editPersonnelEmailAddress").val(email);

  editPersonnelDepartmentSelect.empty();
  $.each(personnelData.data.department, function () {
    editPersonnelDepartmentSelect.append(new Option(this.name, this.id));
  });
  editPersonnelDepartmentSelect.val(departmentID);
}

//  ################################### Updating Personel Record Details ########################################

editPersonnelModal.on("show.bs.modal", function (e) {
  const personnelId = $(e.relatedTarget).attr("data-id");
  fetchData("libs/php/getPersonnelByID.php", { id: personnelId }).then(populateEditModal);
});

function handlePersonnelSubmit(e) {
  e.preventDefault();
  const updatedData = {
    personnelId: $("#editPersonnelEmployeeID").val(),
    updatedFirstName: $("#editPersonnelFirstName").val(),
    updatedLastName: $("#editPersonnelLastName").val(),
    updatedJobTitle: $("#editPersonnelJobTitle").val(),
    updatedEmail: $("#editPersonnelEmailAddress").val(),
    updatedDepartment: editPersonnelDepartmentSelect.val(),
  };

  fetchData("libs/php/updatePersonnel.php", updatedData).then(() => {
    fetchDataAndRefreshRecords(
      "libs/php/getAll.php",
      "#PersonnelRecordContainer",
      personnelTemplate
    );
  });
}
$("#savePersonnelBtn").on("click", handlePersonnelSubmit);

//  ############################## Opening up Department edit modal and autofilling ###################################################
const editDepartmentModal = $("#editDepartmentModal");
const editDepartmentForm = $("#editDepartmentForm");
const editDepartmentLocationSelect = $("#editDepartmentLocation");

// Function to populate the edit modal
function populateDepartmentEditModal(departmentData) {
  const { id, name, locationID } = departmentData.data.department[0];

  $("#editDepartmentID").val(id);
  $("#editDepartmentName").val(name);
  $("editDepartmentLocation").val(locationID);

  editDepartmentLocationSelect.empty(locationID);
  $.each(departmentData.data.location, function () {
    editDepartmentLocationSelect.append(new Option(this.name, this.id));
  });
  editDepartmentLocationSelect.val(locationID);
}

editDepartmentModal.on("show.bs.modal", function (e) {
  const departmentId = $(e.relatedTarget).attr("data-id");
  fetchData("libs/php/getDepartmentByID.php", { id: departmentId }).then(
    populateDepartmentEditModal
  );
});

//  ################################### Updating Department Record Details ########################################
function handleDepartmentSubmit(e) {
  e.preventDefault();
  const updatedData = {
    departmentId: $("#editDepartmentID").val(),
    updatedDepartmentName: $("#editDepartmentName").val(),
    updatedDepartmentLocation: editDepartmentLocationSelect.val(),
  };

  fetchData("libs/php/updateDepartment.php", updatedData).then((result) => {
    fetchDataAndRefreshRecords(
      "libs/php/getAllDepartments.php",
      "#departmentRecordContainer",
      departmentTemplate
    );
  });
}

editDepartmentForm.on("submit", handleDepartmentSubmit);
//  ############################## Opening up Department edit modal and autofilling ###################################################

const editLocationModal = $("#editLocationModal");
const editLocationForm = $("#editLocationForm");

// Function to populate the edit location modal
function populateLocationEditModal(LocationData) {
  const { id, name } = LocationData.data.location[0];

  $("#editLocationID").val(id);
  $("#editLocationName").val(name);
}

//  ################################### Updating Location Record Details ########################################

function handleLocationSubmit(e) {
  e.preventDefault();
  const updatedData = {
    locationId: $("#editLocationID").val(),
    name: $("#editLocationName").val(),
  };

  fetchData("libs/php/updateLocation.php", updatedData).then((result) => {
    fetchDataAndRefreshRecords(
      "libs/php/getAllLocation.php",
      "#locationRecordContainer",
      locationTemplate
    );
  });
}

editLocationModal.on("show.bs.modal", function (e) {
  const locationId = $(e.relatedTarget).attr("data-id");
  fetchData("libs/php/getLocationById.php", { id: locationId }).then(populateLocationEditModal);
});

editLocationForm.on("submit", handleLocationSubmit);

// ################################### Deleting Personel Records ########################################

$(document).on("click", ".deletePersonnelBtn", function () {
  // Retrieve the data-id attribute
  var recordId = $(this).data("id");
  fetchData("libs/php/getPersonnelByID.php", { id: recordId }).then((result) => {
    $("#areYouSurePersonnel").text(
      `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`
    );
    $("#deletePersonnelConfirmationModal").modal("show");
    $("#deletePersonnelYesBtn").click(function () {
      fetchData("libs/php/deletePersonnel.php", { id: recordId }).then((result) => {
        fetchDataAndRefreshRecords(
          "libs/php/getAll.php",
          "#PersonnelRecordContainer",
          personnelTemplate
        );
      });
    });
  });
});

//  ################################### Deleting Departments Records ########################################
// let messageElement = document.getElementById("message");

$(document).on("click", ".deleteDepartmentBtn", function () {
  var departmentId = $(this).data("id"); // Use .data() for data attributes
  // $("#deleteConfirmation").modal("show");
  fetchData("libs/php/checkDepartmentUse.php", { departmentId }).then((result) => {
    if (result.status == "success") {
      if (result.data.personnelCount == 0) {
        $("#areyousureDepartment").text(result.data.departmentName);
        $("#deleteDepartmentConfirmationModal").modal("show");
        $("#deleteYesBtn").click(function () {
          fetchData("libs/php/deleteDepartment.php", { departmentId: departmentId }).then(
            (result) => {
              fetchDataAndRefreshRecords(
                "libs/php/getAllDepartments.php",
                "#departmentRecordContainer",
                departmentTemplate
              );
            }
          );
        });
      } else {
        $("#cannotDeleteDepartmentName").text(result.data.departmentName);
        $("#personnelCount").text(result.data.personnelCount);
        $("#cannotDeleteDepartmentModal").modal("show");
      }
    }
  });
});

//  ################################### Deleting Location Records ########################################

$(document).on("click", ".deleteLocationBtn", function () {
  // Get the location ID from the data attribute of the button
  var locationId = $(this).attr("data-id");
  fetchData("libs/php/checkLocation.php", { locationId }).then((result) => {
    if (result.status.code == "200") {
      if (result.data.departmentCount == 0) {
        $("#areYouSureLocation").text(result.data.locationName);
        $("#deleteLocationConfirmationModal").modal("show");
        $("#deleteLocationYesBtn").click(function () {
          fetchData("libs/php/deleteLocation.php", { locationId }).then((result) => {
            fetchDataAndRefreshRecords(
              "libs/php/getAllLocation.php",
              "#locationRecordContainer",
              locationTemplate
            );
          });
        });
      } else {
        $("#cannotDeleteLocationName").text(result.data.locationName);
        $("#departmentCount").text(result.data.departmentCount);
        $("#cannotDeleteLocationModal").modal("show");
      }
    }
  });
});
