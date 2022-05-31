import TripTabsView from '../view/trip-tabs-view';
import FilterView from '../view/filter-view.js';
import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPresenter from './event-presenter.js';
import {updateItem} from '../mock/utils.js';
import {render, RenderPosition} from '../render.js';

export default class TripPresenter {
  #tripContainer = null;
  #menuContainer = null;
  #filterContainer = null;
  #tripEvents = [];
  #eventPresenters = new Map();
  #menuComponent = new TripTabsView();
  #filterComponent = new FilterView();
  #sortComponent =  new SortView();
  #listEventComponent = new EventsListView();
  #eventEmptyComponent = new EmptyListView();

  constructor(tripContainer, menuContainer, filterContainer) {
    this.#tripContainer = tripContainer;
    this.#menuContainer = menuContainer;
    this.#filterContainer = filterContainer;
  }

  init = (tripEvents) => {
    this.#tripEvents = [...tripEvents];

    render(this.#menuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
    render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.resetView());
  }

  #handleEventChange = (updatedEvent) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderListEvent = () => {
    render(this.#tripContainer, this.#listEventComponent, RenderPosition.BEFOREEND);
  }

  #renderEvent = (tripEvent) => {
    const eventPresenter = new EventPresenter(this.#listEventComponent, this.#handleEventChange, this.#handleModeChange);
    eventPresenter.init(tripEvent);
    this.#eventPresenters.set(tripEvent.id, eventPresenter);
  }

  #renderEvents = () => {
    this.#tripEvents.forEach((tripEvent) => this.#renderEvent(tripEvent));
  }

  #clearEventList = () => {
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderNoEvents = () => {
    render(this.#tripContainer, this.#eventEmptyComponent, RenderPosition.BEFOREEND);
    this.#listEventComponent.element.remove();
    this.#sortComponent.element.remove();
  }

  #renderBoard = () => {
    if(this.#tripEvents.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderListEvent();
    this.#renderEvents();
  }
}