import { create } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { Aircraft, Airport, Assignment, SearchFormParameters } from '../types/types';

type State = {
  accountInformation: any;
  aircraft: Aircraft[]; // Assuming aircraft is an array of some type
  airport?: Airport[];
  assignments: Assignment[];
  isOpen: boolean;
  myFlight: null | Assignment;
  pageToShow: string;
  searchFormParameters: SearchFormParameters | null;
  addAircraft: (aircraft: Aircraft[]) => void;
  addAirport: (airport: Airport[]) => void;
  addAssignment: (assignment: Assignment) => void;
  addAssignments: (assignments: Assignment[]) => void;
  clearAssignmentsAndAircraft: () => void;
  getAircraftByRegistration: (registration: string) => Aircraft | undefined;
  getAirportByIcao: (icao: string) => Airport | undefined;
  setPageToShow: (page: string) => void;
  setSearchFormParameters: (searchFormParameters: SearchFormParameters) => void;
  toggleCollapse: () => void;
  setIsOpen: (isOpen: boolean) => void;
};

export const useStore = create<State>()(
  persist(
    devtools(
      subscribeWithSelector((set, get) => ({
        accountInformation: null,
        aircraft: [],
        airport: [],
        assignments: [],
        isOpen: false,
        myFlight: null,
        pageToShow: 'search',
        searchFormParameters: null,
        toggleCollapse: () => set((state) => ({ isOpen: !state.isOpen })),

        addAircraft: (aircraft: Aircraft[]) =>
          set((state) => {
            const existingRegistrations = new Set(state.aircraft.map((aircraft) => aircraft.registration));
            const uniqueAircraft = aircraft.filter((aircraft) => !existingRegistrations.has(aircraft.registration));
            return { aircraft: [...state.aircraft, ...uniqueAircraft] };
          }),

        addAirport: (airport: Airport[]) =>
          set((state) => {
            if (state.airport) {
              const existingIcao = new Set(state.airport.map((airport) => airport.icao));
              const uniqueAirports = airport.filter((a) => !existingIcao.has(a.icao));
              return { airport: [...state.airport, ...uniqueAirports] };
            }
            return { airport };
          }),

        // Prevent duplicates when adding a single assignment
        addAssignment: (assignment: Assignment) =>
          set((state) => {
            if (state.assignments.some((a) => a.assignmentId === assignment.assignmentId)) {
              return state; // already exists, no-op
            }
            return { assignments: [...state.assignments, assignment] };
          }),

        // Prevent duplicates when adding multiple assignments
        addAssignments: (assignments: Assignment[]) =>
          set((state) => {
            const existingIds = new Set(state.assignments.map((assignment) => assignment.assignmentId));
            const uniqueAssignments = assignments.filter((assignment) => !existingIds.has(assignment.assignmentId));
            if (uniqueAssignments.length === 0) return state; // nothing new to add
            return { assignments: [...state.assignments, ...uniqueAssignments] };
          }),

        clearAssignmentsAndAircraft: () =>
          set(() => ({
            aircraft: [],
            assignments: [],
          })),

        getAirportByIcao: (icao: string) => {
          if (!icao) {
            console.warn('No ICAO provided');
            return undefined;
          }
          return get().airport?.find((airport) => airport.icao === icao);
        },

        getAircraftByRegistration: (registration: string) => {
          if (!registration) {
            console.warn('No registration provided');
            return undefined;
          }
          return get().aircraft.find((aircraft) => aircraft.registration === registration);
        },

        getAssignmentById: (assignmentId: number) =>
          get().assignments.find((assignment) => assignment.assignmentId === assignmentId),

        setPageToShow: (page: string) => set({ pageToShow: page }),

        setIsOpen: (isOpen: boolean) => set({ isOpen }),

        setSearchFormParameters: (searchFormParameters: SearchFormParameters) => set({ searchFormParameters }),
      })),
    ),
    {
      name: 'fse-tools-storage', // key in localStorage
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({
        accountInformation: state.accountInformation,
        aircraft: state.aircraft,
        assignments: state.assignments,
        isOpen: state.isOpen,
        pageToShow: state.pageToShow,
      }),
      version: 1,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('❌ Failed to rehydrate store:', error);
        } else {
          console.log('✅ FSE Tools Store rehydrated');
        }
      },
    },
  ),
);
