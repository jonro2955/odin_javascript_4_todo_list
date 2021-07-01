# Under Development

Preview: https://jonro2955.github.io/odin_javascript_4_todo_list/

# Instructions https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/todo-list#introduction

Todo lists are a staple in beginning webdev tutorials because they can be very simple. There is, however, a lot of room for improvement and many features that can be added.

Before diving into the code, take a minute to think about how you are going to want to organize your project.

Your ‘todos’ are going to be objects that you’ll want to dynamically create, which means either using factories or constructors/classes to generate them.

Brainstorm what kind of properties your todo-items are going to have. At a minimum they should have a title, description, dueDate and priority. You might also want to include notes or even a checklist.

Your todo list should have projects or separate lists of todos. When a user first opens the app, there should be some sort of ‘default’ project to which all of their todos are put. Users should be able to create new projects and choose which project their todos go into.

You should separate your application logic (i.e. creating new todos, setting todos as complete, changing todo priority etc.) from the DOM-related stuff, so keep all of those things in separate modules.

The look of the User Interface is up to you, but it should be able to do the following:
view all projects
view all todos in each project (probably just the title and duedate.. perhaps changing color for different priorities)
expand a single todo to see/edit its details
delete a todo

For inspiration, check out the following great todo apps. (look at screenshots, watch their introduction videos etc.)

Todoist: https://en.todoist.com/
Things: https://culturedcode.com/things/
any.do: https://www.any.do/ 

Use localStorage to save user’s projects and todos between sessions.

Since you are probably already using webpack, adding external libraries from npm is a cinch! You might want to consider using the following useful library in your code:
date-fns(https://github.com/date-fns/date-fns) gives you a bunch of handy functions for formatting and manipulating dates and times.

Examples: https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/todo-list#want-more-practice 