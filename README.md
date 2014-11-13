#Mandelbrot.js
==============

Simplify complex things. Create loosly copled systems. Seperate concerns. 
Be efficent. Just do all of those things when you code, and Mandelbrot can 
help. It's a pattern that lends it's self to REST and JSON collections, Data 
Pipes, patterns that isolate scoe like ADM using Require.js and injection in 
Angular.js. The tasks a developer is given are arbitrary. Mandelbrot is here 
to make creating and maintaing the solution easier.

##Overview
Mandelbrot is factory for updating  and synchronizing data. At it's core is 
the ability to take an object and use it as a template to create a class 
based on its properties. That class can then be used to wrap that object and 
others like it. With the class comes the ability to update it (it's prototype) 
wtih actions to perform when getting and setting properties on the object.

##What it's doing
###Setters
When setting a property any update functions for that proper are called. This 
collection of modifiers has the new value, the old value, and the result of 
the last modifier. The modifier can be a simple function that is used to 
trigger an event, a step in a calculation, a rule for business logic or all 
of them. Modifiers are a collection, and are exposed as such with no 
abstraction. This lends it self to creating data pipes, rule engines, etc, 
that keep all the code localized to that one class.

###Getters
A function can be set to be run when getting that property and perform that 
function on the value. The result of that function is saved as the value of 
the property. That value is cached and returned untill the property is set. 
After that the function will be run again. That function can also use the 
object (this) that the property is on, as well as anything that it was closed 
over. In that way you can created calculated values that derrive from the data 
on the object, and/or any other source, that will be cached intill the poperty 
is "touched" again. 