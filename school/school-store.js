import {types} from 'mobx-state-tree'
import {values} from 'mobx'
import uuidv4 from "uuid/v4";

const Person = types.model('PersonModel', {
  id: types.identifier,
  name: types.string,
  gender: types.enumeration(["Male", "Female"])
})

const SchoolMember = types.model('SchoolMember', {
  id: types.identifier,
  person: Person,
  role: types.enumeration(["Student", "Teacher"])
})

const Class = types.model('ClassModel', {
  students: types.array(SchoolMember),
  teacher: SchoolMember,
  maxStudents: 20,
  title: types.string
})
  .views(self => ({
    get info() {
      const studentNames = values(self.students).map(s => s.person.name).join(", and ");
      return `${self.teacher.person.name} is teaching ${self.title}, to the students: ${studentNames}`
    }
  }))
  .actions(self => ({
    afterCreate() {
      self.info
    },
    enrollStudent (student) {
      if(self.maxStudents.length > 19) return "Class Full"
      self.students.push(student)
    }
  }))

const SchoolStore = types.model("SchoolStore", {
  classes: types.array(Class),
  name: types.string
})
  .views(self => ({
    get info () {
      return `${self.name} teaches the following classes: ${values(self.classes).map(c => c.title).join(", and ")}`
    }
  }))
  .actions(self => ({
    afterCreate(){

        const p1 = Person.create({id: uuidv4(), name: "John", gender: "Male"})
        const p2 = Person.create({id: uuidv4(), name: "Bob", gender: "Male"})
        const p3 = Person.create({id: uuidv4(), name: "Sarah", gender: "Female"})
        const p4 = Person.create({id: uuidv4(), name: "Suzie", gender: "Female"})
  
        const student1 = SchoolMember.create({id: uuidv4(), person: p1, role: "Student"})
  
        const student2 = SchoolMember.create({id: uuidv4(), person: p2, role: "Student"})
  
        const student3 = SchoolMember.create({id: uuidv4(), person: p3, role: "Student"})
  
        const teach = SchoolMember.create({id: uuidv4(), person: p4, role: "Teacher"})
  
        const newClass = Class.create({title: "Geometry", students: [student1, student2, student3], teacher: teach})

        self.classes.push(newClass)
      }
    
  }))

const sunshineElementary = SchoolStore.create({name: "Sunshine Elementary"})

console.log(sunshineElementary.info)