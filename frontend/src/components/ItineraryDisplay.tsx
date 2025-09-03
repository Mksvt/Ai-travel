import React from 'react';
import { Itinerary, DayPlan, Activity } from '../types/travel';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  FaLandmark,
  FaHotel,
  FaBus,
  FaTrain,
  FaTaxi,
  FaPersonWalking,
  FaGripVertical,
} from 'react-icons/fa6';
import { FaPlateWheat } from 'react-icons/fa6';
import { FaPaintbrush } from 'react-icons/fa6';
import { FaTree } from 'react-icons/fa6';

const iconMap: { [key: string]: React.ReactElement } = {
  museum: <FaPaintbrush className="text-blue-500" />,
  restaurant: <FaPlateWheat className="text-orange-500" />,
  park: <FaTree className="text-green-500" />,
  attraction: <FaLandmark className="text-purple-500" />,
  hotel: <FaHotel className="text-red-500" />,
  bus: <FaBus />,
  train: <FaTrain />,
  taxi: <FaTaxi />,
  walk: <FaPersonWalking />,
};

const getIcon = (type: string) => {
  return iconMap[type] || <FaLandmark className="text-gray-500" />;
};

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  setItinerary: React.Dispatch<React.SetStateAction<Itinerary | null>>;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  itinerary,
  setItinerary,
}) => {
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceDayIndex = itinerary.itinerary.findIndex(
      (day) => `day-${day.day}` === source.droppableId
    );
    const destDayIndex = itinerary.itinerary.findIndex(
      (day) => `day-${day.day}` === destination.droppableId
    );

    const newItineraryData = { ...itinerary };
    const sourceDay = { ...newItineraryData.itinerary[sourceDayIndex] };
    const sourceActivities = [...sourceDay.activities];
    const [movedActivity] = sourceActivities.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      // Move within the same day
      sourceActivities.splice(destination.index, 0, movedActivity);
      sourceDay.activities = sourceActivities;
      newItineraryData.itinerary[sourceDayIndex] = sourceDay;
    } else {
      // Move to a different day
      const destDay = { ...newItineraryData.itinerary[destDayIndex] };
      const destActivities = [...destDay.activities];
      destActivities.splice(destination.index, 0, movedActivity);

      sourceDay.activities = sourceActivities;
      destDay.activities = destActivities;

      newItineraryData.itinerary[sourceDayIndex] = sourceDay;
      newItineraryData.itinerary[destDayIndex] = destDay;
    }

    setItinerary(newItineraryData);
  };

  if (!itinerary) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4 space-y-6">
        <h2 className="text-3xl font-bold text-center">
          Your Trip to {itinerary.city}
        </h2>
        <div className="text-center">
          <p className="text-lg">
            Total Estimated Cost:{' '}
            <span className="font-semibold">
              ${itinerary.summary.totalCost}
            </span>
          </p>
        </div>
        {itinerary.itinerary.map((day) => (
          <Droppable key={day.id} droppableId={`day-${day.day}`}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="p-4 border border-gray-200 rounded-lg shadow-sm"
              >
                <h3 className="text-2xl font-semibold">Day {day.day}</h3>
                {day.hotel && (
                  <div className="p-3 mt-2 bg-blue-50 rounded-md flex items-center">
                    <span className="mr-3">{getIcon('hotel')}</span>
                    <div>
                      <h4 className="font-bold">Hotel: {day.hotel.name}</h4>
                      <p>Price: ${day.hotel.price}</p>
                    </div>
                  </div>
                )}
                <div className="mt-4 space-y-3">
                  <h4 className="font-bold">Activities:</h4>
                  {day.activities.map((activity, index) => (
                    <Draggable
                      key={activity.id}
                      draggableId={activity.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 rounded-md flex items-start ${
                            snapshot.isDragging
                              ? 'bg-gray-100 shadow-lg'
                              : 'bg-gray-50'
                          }`}
                        >
                          <span className="mr-4 mt-1 text-gray-400 cursor-grab">
                            <FaGripVertical />
                          </span>
                          <div className="flex-grow">
                            <p className="font-semibold flex items-center">
                              <span className="mr-2">
                                {getIcon(activity.type)}
                              </span>
                              {activity.place} ({activity.type})
                            </p>
                            <p className="text-sm text-gray-600 pl-6">
                              {activity.description}
                            </p>
                            <p className="text-sm font-medium pl-6">
                              Cost: ${activity.cost}
                            </p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="font-bold">Transport:</h4>
                  {day.transport.map((leg, index) => (
                    <p
                      key={index}
                      className="text-sm text-gray-600 flex items-center"
                    >
                      <span className="mr-2">{getIcon(leg.mode)}</span>
                      {leg.from} → {leg.to} ({leg.mode})
                    </p>
                  ))}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default ItineraryDisplay;
