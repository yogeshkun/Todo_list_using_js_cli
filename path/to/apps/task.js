// Handling text file
const fs = require("fs");

//Read file pending list
var pending_file_path = "./path/to/plans/task.txt";
var complete_file_path = "./path/to/plans/complete.txt";

//Creating empty variable to store the file
let fileContents;
let completeContents;

let InitialValue = () => {
  fileContents = fs.readFileSync(pending_file_path, "utf-8");

  if (fileContents.length != 0) {
    let lines = fileContents.slice(0, fileContents.length - 1).split("\n");
    let objects = [];

    lines.forEach((line) => {
      let [number, string] = line.split(/\s(.+)/);
      objects.push({
        priority: Number(number),
        task: string,
      });
    });
    objects.sort((a, b) => a.priority - b.priority);
    fileContents = objects;
  }
};
InitialValue();

//Read file completed list

let CompletedValue = () => {
  let dataArray;
  dataArray = fs.readFileSync(complete_file_path, "utf-8");
  completeContents = dataArray.slice(0, dataArray.length - 1).split("\n");
};
CompletedValue();

//Taking arguments
const args = process.argv;
Check_Function(args);

function Check_Function(args) {
  switch (args[2]) {
    case "add":
      AddTask(args);
      InitialValue();
      break;
    case "ls":
      InitialValue();
      Displayls(fileContents);
      break;
    case "done":
      DoneTask(args, fileContents);
      break;
    case "help":
      console.log(TaskUsage());
      break;
    case undefined:
      console.log(TaskUsage());
      break;
    case "del":
      del(args, fileContents);
      break;
    case "report":
      report(fileContents, completeContents);
      break;
    case "DeleteAllTest":
      DeleteAllTest();
      break;
    case "DeleteAllCompletedTest":
      DeleteAllCompletedTest();
  }
}

function Displayls(datas) {
  if (fileContents.length > 0) {
    let str = "";
    datas.map((val, index) => {
      console.log(
        (index + 1).toString() +
          ". " +
          val.task +
          " [" +
          val.priority.toString() +
          "]"
      );
      str +=
        (index + 1).toString() +
        ". " +
        val.task +
        " [" +
        val.priority.toString() +
        "]\n";
    });
    let exp = `1. the thing i need to do [1]
    2. water the plants [2]
    3. find needle in the haystack [3]
    `;
    
  } else {
    console.log("There are no pending tasks!");
  }
}

// Add task
function AddTask(args) {
  if (args[3] == undefined || args[4] == undefined) {
    console.log("Error: Missing tasks string. Nothing added!");
  } else {
    let content = args[3] + " " + args[4] + "\n";
    var logger = fs.createWriteStream(pending_file_path, {
      flags: "a",
    });
    if (fileContents.length > 0) {
      const writeLine = (line) => logger.write(`${line}`);
      writeLine(content);
    } else {
      logger.write(content);
    }

    logger.end(); // close string

    var ReturnStatment =
      'Added task: "' + args[4] + '" with priority ' + args[3];
    console.log(ReturnStatment);
  }
}

function DoneTask(args, pendingList) {
  const TaskNo = parseInt(args[3]);
  console.log("task no ", typeof TaskNo);
  if (isNaN(TaskNo) || TaskNo === "") {
    console.log("Error: Missing NUMBER for marking tasks as done.");
  } else {
    if (TaskNo > 0 && TaskNo < pendingList.length + 1) {
      let task = pendingList[TaskNo - 1];
      pendingList.splice(TaskNo - 1, 1);
      pending_list(pendingList);
      completed_list(task.task);
      console.log("Marked item as done.");
    } else {
      console.log(
        "Error: no incomplete item with index #" + TaskNo + " exists."
      );
      Displayls(fileContents);
    }

    function pending_list(List) {
      var logger = fs.createWriteStream(pending_file_path, {
        flags: "w",
      });
      List.forEach(function (object) {
        let content = object.priority + " " + object.task + "\n";

        // console.log("Pending list\n", content);

        logger.write(`${content}`);
      });
      logger.end(); // close string
    }

    function completed_list(completed_task) {
      var logger = fs.createWriteStream(complete_file_path, {
        flags: "a",
      });

      logger.write(`${completed_task + "\n"}`);

      logger.end(); // close string
    }
  }
  // console.log(fileContents)
}

function TaskUsage() {
  let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

  return usage;
}

//Delete particular Task

function del(args, pendingList) {
  const TaskNo = parseInt(args[3]);

  if (isNaN(TaskNo) || TaskNo === "") {
    console.log("Error: Missing NUMBER for deleting tasks.");
  } else {
    if (TaskNo > 0 && TaskNo < pendingList.length + 1) {
      pendingList.splice(TaskNo - 1, 1);
      pending_list(pendingList);
      function pending_list(List) {
        var logger = fs.createWriteStream(pending_file_path, {
          flags: "w",
        });
        List.forEach(function (object) {
          let content = object.priority + " " + object.task + "\n";

          // console.log("Pending list\n", content);

          logger.write(`${content}`);
        });
        logger.end(); // close string
      }
      console.log("Deleted task #" + TaskNo);
    } else {
      console.log(
        "Error: task with index #" +
          TaskNo +
          " does not exist. Nothing deleted."
      );
      Displayls(fileContents);
    }
  }
}
//Display Pending and Completed Task
function report(pending_list, completed_list) {
  console.log("Pending : " + pending_list.length);
  // console.log("\n")
  if (pending_list.length > 0) {
    pending_list.map((val, index) => {
      console.log(index + 1 + ". " + val.task + " [" + val.priority + "]");
    });
  } else {
    console.log("There are no pending tasks!");
  }
  console.log("\nCompleted : " + completed_list.length);
  // console.log("\n")
  if (completed_list.length > 0) {
    completed_list.map((val, index) => {
      console.log(index + 1 + ". " + val);
    });
  } else {
    console.log("There are no pending tasks!");
  }
}

//Delete all
function DeleteAllTest() {
  var logger = fs.createWriteStream(pending_file_path, {
    flags: "w",
  });
  logger.end(); // close string

  console.log("*****************************\n");
}

function DeleteAllCompletedTest() {
  var logger = fs.createWriteStream(complete_file_path, {
    flags: "w",
  });
  logger.end(); // close string

  console.log("*****************************\n");
}
