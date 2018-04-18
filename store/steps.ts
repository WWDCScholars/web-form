import Vue from 'vue';
import Step from '~/types/Step';
const initialSteps = require('~/resources/steps.json');

export const state = () => ({
  steps: Step.slugMap(initialSteps),
  currentStepIndex: 0
});

export const getters = {
  firstStep(state): Step {
    const keys = Object.keys(state.steps);
    return state.steps[keys[0]];
  }
};

export const mutations = {
  updateField(state, { slug, section, field, value }) {
    Vue.set(
      state.steps[slug].sections[section].fields[field],
      'model',
      value
    );
  },
  setStepFinished(state, { slug, value }) {
    Vue.set(state.steps[slug], 'finished', value);
  },
  fillStepsWithExistingData({ steps }, { scholarFields, socialFields }) {
    for (let key of Object.keys(steps)) {
      for (let section of steps[key].sections) {
        for (let field of section.fields) {
          if (scholarFields[field.name]) {
            if (field.type === 'location') {
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
};

export const actions = {
  fillSteps({ state, commit, dispatch }, data) {
    commit('fillStepsWithExistingData', data);
    // look slugs and evaluate completion
    for (let slug of Object.keys(state.steps)) {
      dispatch('evaluateStepCompletion', { slug, errors: false });
    }
  },
  evaluateStepCompletion({ commit, state }, { slug, errors }) {
    const step = state.steps[slug];
    const finished = !errors && step.evaluateCompletion();
    if (step.finished !== finished) {
      commit('setStepFinished', { slug, value: finished });
    }
  }
};
