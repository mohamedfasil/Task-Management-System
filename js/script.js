var taskblocks,dragTask=null,dragginglistid,draggingtaskid,dragtargetlistid,dragtargettaskid;;
function List(listname){
	var otr=document.getElementsByClassName('lists');
  	var newid=otr.length+1;
  	var div=document.createElement('div');
  	div.innerHTML='<div><i class="icon icon-th-list"></i> <h4 class="inline">'+listname+'</h4></div><div class="task-list-holder"><div class="lists" id="task-list-'+newid+'" ></div></div><div class="new-task-holder"><form id="new-form-'+newid+'" type="post" onSubmit="addTask('+newid+');return false;"><input type="text" name="newtask" class="newtask" placeholder="New Task.." id="input-'+newid+'"/><input class="btn btn-info " type="submit"  value="Add Task" /></form></div>';
	div.setAttribute('class','span4 list-container well');
	div.setAttribute('id','list-'+newid);
  	document.getElementById('lists').insertBefore(div,document.getElementById('add-new-button-holder'));
  	var row={'id':newid,'name':listname};
  	if((typeof localStorage!="undefined") && typeof localStorage.lists=="undefined"){
		var lists=[];
		lists[0]=row;
		localStorage.lists=JSON.stringify(lists);
	}else{
		var lists=JSON.parse(localStorage.lists);
		lists.push(row);
		localStorage.lists=JSON.stringify(lists);
	}
}

function Task(value,id){
	var ul=document.getElementById("task-list-"+listid);
	var count=ul.getElementsByClassName('list-block').length;
	parsetaskHTML(id,count,value);
	var curtasks='tasks'+id;
	var value={'id':count,'task':value};
	if((typeof localStorage!="undefined") && typeof localStorage[curtasks]=="undefined"){
		var tasks=[];
		tasks[0]=value;
		localStorage[curtasks]=JSON.stringify(tasks);
	}else{
		var tasks=JSON.parse(localStorage[curtasks]);
		tasks.push(value);
		localStorage[curtasks]=JSON.stringify(tasks);
	}
	
};


function addTask(id){
	var newtask=document.getElementById("input-"+id);
	new Task(newtask.value,id);
	newtask.value="";
}

function editTask(list,task){
	var li=document.getElementById('task-'+list+'-'+task);
	var taskname=document.getElementById('taskname-'+list+'-'+task).innerHTML;
	li.innerHTML='<form type="post" onSubmit="updateTask('+list+','+task+'); return false;"><input autocomplete="off" class="small-input" type="text" name="editTask" id="updateTask-'+list+'-'+task+'" value="'+taskname+'"/><button type="button" class="btn btn-small">Update</button></form>';

}

function updateTask(list,task){
	var taskname=document.getElementById('updateTask-'+list+'-'+task).value;
	parsetaskHTML(list,task,taskname);
	if(typeof localStorage!="undefined"){
		var tasklist='tasks'+list;
		var tasks=JSON.parse(localStorage[tasklist]);
		for (var k = 0; k < tasks.length; k++) {
			if(tasks[k]['id']==task){
				tasks[k]['task']=taskname;
			}
		}
		localStorage[tasklist]=JSON.stringify(tasks);
	}
}

function deleteTask(list,task){
	var c=confirm('Are you Sure?');
	if(c){
		document.getElementById('task-'+list+'-'+task).remove();
		if(typeof localStorage!="undefined"){
			var tasklist='tasks'+list;
			var tasks=JSON.parse(localStorage[tasklist]);
			for (var k = 0; k < tasks.length; k++) {
				if(tasks[k]['id']==task){
					tasks.splice(k,1);
				}
			}
			localStorage[tasklist]=JSON.stringify(tasks);
		}
	}
}

function parsetaskHTML(listid,taskid,taskname){
	var kstr='<span class="pull-left" id="taskname-'+listid+'-'+taskid+'">'+taskname+'</span><a href="javascript:void(0);" onclick="deleteTask('+listid+','+taskid+');return false;" class="pull-right"><i class="icon icon-remove"></i></a><span class="pull-right">&nbsp;&nbsp;</span><a href="javascript:void(0);" onclick="editTask('+listid+','+taskid+');return false;" class="pull-right"><i class="icon icon-pencil"></i></a>';
	
	if(document.getElementById('task-'+listid+'-'+taskid)!=null){
		var li=document.getElementById('task-'+listid+'-'+taskid);
		li.innerHTML=kstr;
	}else{
		var ul=document.getElementById("task-list-"+listid);
		var li=document.createElement("div");
		li.setAttribute('id','task-'+listid+'-'+taskid);
		li.setAttribute('class','list-block draggable');
		li.setAttribute('draggable','true');
		li.innerHTML=kstr;
		ul.appendChild(li);
	}
	taskblocks=document.querySelectorAll('.draggable');
}




function addlist(){
  var otr=document.getElementsByClassName('lists');
  var newid=otr.length+1;
  var listname=prompt("Please Enter List name","List "+newid);
  if(listname !=null){
  	new List(listname);
  }
}

function deleteList(list){
	var c=confirm('Are you Sure? This will delete the list and all tasks in it');
	if(c){
		document.getElementById('list-'+list).remove();
		if(typeof localStorage!="undefined"){
			var lists=JSON.parse(localStorage.lists);
			var tasklist='tasks'+list;
			if(typeof localStorage.tasklist!="undefined"){
				delete localStorage.tasklist;	
			}
			for (var k = 0; k < lists.length; k++) {
				if(lists[k]['id']==list){
					console.log(lists[k]['id']);
					lists.splice(k,1);
				}
			}
			localStorage.lists=JSON.stringify(lists);
		}
	}
}




function init(){
	if((typeof localStorage!="undefined") && (typeof localStorage.lists!="undefined")){
		var lists=JSON.parse(localStorage.lists);
		for (var i = 0; i < lists.length; i++) {
			var el=lists[i];
			listname=el['name'];
			listid=el['id'];
			var div=document.createElement('div');
  			div.innerHTML='<div><i class="icon icon-th-list"></i> <h4 class="inline">'+listname+'</h4><a class="pull-right" href="javascript:void(0);" onClick="deleteList('+listid+')"><i class="icon icon-remove"></i></a></div><div class="task-list-holder"><div class="lists" id="task-list-'+listid+'"></div></div><div class="new-task-holder"><form id="new-form-'+listid+'" type="post" onSubmit="addTask('+listid+');return false;"><input type="text" name="newtask" class="newtask" placeholder="New Task.." id="input-'+listid+'"/><input class="btn btn-info " type="submit"  value="Add Task" /></form></div>';
			div.setAttribute('class','span4 list-container well');
			div.setAttribute('id','list-'+listid);
			document.getElementById('lists').insertBefore(div,document.getElementById('add-new-button-holder'));
			var tasks='tasks'+listid;
			if(typeof localStorage[tasks]!="undefined"){
				var tasks=JSON.parse(localStorage[tasks]);
				var ul=document.getElementById("task-list-"+listid);
				for (var k = 0; k < tasks.length; k++) {
					var el=tasks[k];
					var task=el['task'];
					var taskid=el['id'];
					parsetaskHTML(listid,taskid,task);
				}
			}
		};
	}
		taskblocks=document.querySelectorAll('.draggable');
		[].forEach.call(taskblocks, function(task) {
		  task.addEventListener('dragstart', handleDragStart, false);
		  task.addEventListener('dragenter', handleDragEnter, false);
		  task.addEventListener('dragover', handleDragOver, false);
		  task.addEventListener('dragleave', handleDragLeave, false);
		  task.addEventListener('drop', handleDrop, false);
		  task.addEventListener('dragend', handleDragEnd, false);
		});
}


function handleDragStart(e){
	this.style.opacity='0.5';
	dragTask=this;
	var str=dragTask.attributes[0].value.split('-');
	dragginglistid=str[1];
	draggingtaskid=str[2];
	draggingvalue=
	e.dataTransfer.effectAllowed = 'move';
  	e.dataTransfer.setData('text/html', this.outerHTML);
}
function handleDragEnd(){
	[].forEach.call(taskblocks, function (task) {
	    task.classList.remove('moving');
	    task.style.opacity='1';
	  });
}

function handleDragEnter(e) {
  this.classList.add('moving');
}

function handleDragLeave(e) {
  this.classList.remove('moving');
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); 
  }
  e.dataTransfer.dropEffect = 'move'; 
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); 
  }
  if (dragTask != this) {
  	targetid=this.attributes[0].value;
  	var str=targetid.split('-');
	dragtargetlistid=str[1];
	dragtargettaskid=str[2];
	document.getElementById('task-'+dragginglistid+'-'+draggingtaskid).remove();
	var li=document.createElement('div');
	li.setAttribute('id','task-'+dragginglistid+'-'+draggingtaskid);
	li.setAttribute('class','list-block draggable');
	li.setAttribute('draggable','true');
	li.innerHTML=dragTask.innerHTML;
    document.querySelector('#list-'+dragtargetlistid+' .task-list-holder .lists').insertBefore(li,document.getElementById(targetid));
    if(typeof localStorage!="undefined"){
		var tasklist='tasks'+dragginglistid;
		var tasks=JSON.parse(localStorage[tasklist]);
		for (var k = 0; k < tasks.length; k++) {
			if(tasks[k]['id']==draggingtaskid){
				tasks.splice(k,1);
			}
		}
		localStorage[tasklist]=JSON.stringify(tasks);

		var tasklist='tasks'+dragtargetlistid;
		var tasks=JSON.parse(localStorage[tasklist]);
		var name=document.getElementById('taskname-'+dragginglistid+'-'+draggingtaskid).innerHTML;
		var value={'id':draggingtaskid,'task':name};
		for (var k = 0; k < tasks.length; k++) {
			if(tasks[k]['id']==dragtargettaskid){
				tasks.splice(k,0,value);
			}
		}
		console.log(tasks);
		localStorage[tasklist]=JSON.stringify(tasks);
	}
  }
  taskblocks=document.querySelectorAll('.draggable');
  [].forEach.call(taskblocks, function (task) {
    task.classList.remove('moving');
    task.style.opacity='1';
  });
  return false;
}

function handleDragEnd(e) {
  [].forEach.call(taskblocks, function (task) {
    task.classList.remove('over');
  });
}


