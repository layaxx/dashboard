type UnivISReference = {
  _type: string
  _key: string
}

type Person = {
  UnivISRef: UnivISReference
}

type Doz = {
  doz: Person
}

type OrgUnits = {
  orgunit: string[]
}

type Room = {
  UnivISRef: UnivISReference
}

export type Term = {
  startdate?: string
  enddate?: string
  starttime?: string
  endtime?: string
  repeat: string
  room?: Room
}

type Terms = {
  term: Term | Term[]
}

export type Lecture = {
  classification: {
    UnivISRef: UnivISReference
  }
  dozs: Doz
  ects_literature: string
  ects_name: string
  ects_organizational: string
  ects_summary: string
  format: string
  id: number
  leclanguage: string
  name: string
  orgname: string
  orgunits: OrgUnits
  red: string
  sws: string
  turnout: number
  terms?: Terms
  type: string
  _key: string
}
