import Vue from 'vue'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Step } from '~/model'
import initialSteps from '~/resources/steps.json'

export const name = 'steps'

export const types = {
  updateField: 'updateField',
  setStepFinished: 'setStepFinished',
  fillStepsWithExistingData: 'fillStepsWithExistingData'
}

export interface State {
  steps: { [slug: string]: Step }
}

export const state = (): State => ({
  steps: Step.slugMap(initialSteps)
})

export const getters: GetterTree<State, State> = {
  firstStep(state: State): Step {
    const keys = Object.keys(state.steps)
    return state.steps[keys[0]]
  },
  birthday(state: State): number | string | undefined {
    let result: number | undefined
    for (const stepKey in state.steps) {
      const step = state.steps[stepKey]
      for (const section of step.sections) {
        for (const field of section.fields) {
          if (field.name === 'birthday') {
            result = field.model
          }
        }
      }
    }
    return result
  }
}

export const actions: ActionTree<State, State> = {
  fillSteps({ state, commit, dispatch }, data: any) {
    commit(types.fillStepsWithExistingData, data)

    // evaluate step completion
    for (const slug of Object.keys(state.steps)) {
      dispatch('evaluateStepCompletion', { slug, errors: false })
    }
  },
  evaluateStepCompletion({ state, commit }, { slug, errors }: { slug: string, errors: boolean }) {
    const step = state.steps[slug]
    const finished = !errors && step.evaluateCompletion()
    if (step.finished !== finished) {
      commit(types.setStepFinished, { slug, value: finished })
    }
  }
}

export const mutations: MutationTree<State> = {
  [types.updateField](state: State, { slug, section, field, value }: { slug: string, section: string, field: string, value: any }) {
    Vue.set(state.steps[slug].sections[section].fields[field], 'model', value)
  },
  [types.setStepFinished](state: State, { slug, value }: { slug: string, value: boolean }) {
    Vue.set(state.steps[slug], 'finished', value)
  },
  [types.fillStepsWithExistingData](state: State, { scholarFields, socialFields, privateFields }) {
    for (let key of Object.keys(state.steps)) {
      for (let section of state.steps[key].sections) {
        for (let field of section.fields) {
          /*if (privateFields[field.name]) {
            field.model = privateFields[field.name].value;
          } else */if (scholarFields[field.name]) {
            if (field.type === 'image') {
              const url = scholarFields[field.name].value.downloadURL
              field.model = { 0: url }
            } else if (field.type === 'location') {
              const location = scholarFields[field.name].value;
              field.model = { lat: location.latitude, lng: location.longitude };
            } else {
              field.model = scholarFields[field.name].value;
            }
          } else if (socialFields[field.name]) {
            field.model = socialFields[field.name].value;
          }
        }
      }
    }
  }
}
