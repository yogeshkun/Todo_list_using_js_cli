const fs = require("fs");

var task_file_path = "./path/to/plans/task.txt";
var complete_file_path = "./path/to/plans/complete.txt";

let fileContents;
let completeContents;

//read task.txt file
// let readtask = () => {

//   fileContents = fs.readFileSync(task_file_path, "utf-8")

//   if (fileContents.length != 0) {
//     // let lines = fileContents.slice(0, fileContents.length - 1).split("\n");
//     let lines = fileContents.split("\n");
//     lines.pop()
//     console.log(fileContents);
//     let objects = [];

//     lines.forEach((line) => {
//       let [number, string] = line.split(/\s(.+)/); // Match a single whitespacecharacter
//       objects.push({
//         priority: Number(number),
//         task: string,
//       });
//     });
//     objects.sort((a, b) => a.priority - b.priority);
//     fileContents = objects;
//   }
// };

function readtask() {
  var objects = [];
  var task = fs.readFileSync(task_file_path, "utf-8").split("\n")

  if(task.length < 1){
      
      task = task

  }else{
      
      task = task.slice(0, -1); 

  }

  
  task.forEach((line) => {
      let [number, string] = line.split(/\s(.+)/); // Match a single whitespacecharacter
      objects.push({
        priority: Number(number),
        task: string,
      });
    });
  
  objects.sort((a, b) => a.priority - b.priority);
  return objects;
}
// };
// readtask();

//read complete.txt file
function readComplete() {
  var task = fs.readFileSync(complete_file_path, "utf-8").split("\n")
  
  
  if(task.length < 1){
    console.log(task)
    return task
  }else{
    return task.slice(0, -1);
  }
  //read -> split -> delete_last element
  // completeContents = dataArray.slice(0, dataArray.length - 1);
  // console.log(dataArray);
}
// readComplete();

// done -> complete &   add -> task
function appendTask(filename, task) {
  var appendtask = fs.createWriteStream(filename, { flags: "a" });
  appendtask.write(task+"\n"); //
  appendtask.end();
}

function writeTasks(filename, object) {
  var logger = fs.createWriteStream(filename, { flags: "w" });
  object.forEach(function (row) {
    logger.write(row.priority + " " + row.task + "\n");
    // logger.write(`${content}`);
  });
  logger.end();
}

//Taking arguments from cli

const args = process.argv;

switch (args[2]) {
  case "add":
    add(args);
    // readtask();
    break;
  case "ls":
    // readtask();
    ls();
    break;
  case "done":
    done(args[3]);
    break;
  case "help":
    console.log(help());
    break;
  case undefined:
    console.log(help());
    break;
  case "del":
    del(args[3]);
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

// To display the pending list
function ls() {
  var pendingTasks = readtask();
  if (pendingTasks.length > 0) {
    pendingTasks.map((val, index) => {
      console.log(
        (index + 1).toString() +
          ". " +
          val.task +
          " [" +
          val.priority.toString() +
          "]"
      );
    });
  } else {
    console.log("There are no pending tasks!");
  }
}

//To add new task and its priority in pending list
function add(args) {
  if (args[3] == undefined || args[4] == undefined) {
    console.log("Error: Missing tasks string. Nothing added!");
  } else {
    let content = args[3] + " " + args[4] + "\n";

    appendTask(task_file_path, content);
    var ReturnStatment =
      'Added task: "' + args[4] + '" with priority ' + args[3];
    console.log(ReturnStatment);
  }
}

//Removing task from pending list and adding it in completed list
function done(taskNo) {
  var pendingTasks = readtask();
  // var taskNo = parseInt(args[3]);
  if (isNaN(taskNo) || taskNo === "") {
    console.log("Error: Missing NUMBER for marking tasks as done.");
  } else {
    if (taskNo > 0 && taskNo < pendingTasks.length + 1) {
      let task = pendingTasks.splice(taskNo - 1, 1);
      writeTasks(task_file_path, pendingTasks); // to task.txt
      appendTask(complete_file_path, task[0].task); // a
      console.log("Marked item as done.");
    } else {
      console.log(
        "Error: no incomplete item with index #" + taskNo + " exists."
      );
    }
  }
}

//
function help() {
  let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

  return usage;
}

function del(taskNo) {
  if (isNaN(taskNo) || taskNo === "") {
    console.log("Error: Missing NUMBER for deleting tasks.");
  } else {
    var pendingTasks = readtask();
    if (taskNo > 0 && taskNo < pendingTasks.length + 1) {
      pendingTasks.splice(taskNo - 1, 1);
      writeTasks(task_file_path, pendingTasks); // to task.txt

      console.log(`Deleted task #${taskNo}`);
    } else {
      console.log(
        "Error: task with index #" +
          taskNo +
          " does not exist. Nothing deleted."
      );
    }
  }
}

//Creates report of pending and completed task
function report() {
  var pendingTasks = readtask();
  var completedTasks = readComplete();

  console.log("\nPending : " + pendingTasks.length);
  if (pendingTasks.length > 0) {
    pendingTasks.map((val, index) => {
      console.log(index + 1 + ". " + val.task + " [" + val.priority + "]");
    });
  } else {
    console.log("There are no pending tasks!");
  }

  console.log("\nCompleted : " + completedTasks.length);
  if (completedTasks.length > 0) {
    completedTasks.map((val, index) => {
      console.log(index + 1 + ". " + val);
    });
  } else {
    console.log("There are no compeleted tasks!");
  }
}

//Delete all task from task.txt
function DeleteAllTest() {
  var logger = fs.createWriteStream(task_file_path, {
    flags: "w",
  });
  logger.end();
}

//Delete all task from complete.txt
function DeleteAllCompletedTest() {
  var logger = fs.createWriteStream(complete_file_path, {
    flags: "w",
  });
  logger.end();
}

// Appending the task in file


// del -> task & done -> task working same
// function pending_list(List) {
//   var logger = fs.createWriteStream(task_file_path, {
//     flags: "w",
//   });
//   List.forEach(function (object) {
//     let content = object.priority + " " + object.task + "\n";
//     logger.write(`${content}`);
//   });

// }
