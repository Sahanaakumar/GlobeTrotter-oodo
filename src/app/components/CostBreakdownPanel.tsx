import { Info, Plane, Hotel, Utensils, Activity as ActivityIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card';
import { useTrips, Trip } from '../contexts/TripContext';

interface CostBreakdownPanelProps {
  trip: Trip;
  showChart?: boolean;
}

/**
 * Cost Breakdown Panel Component
 * Displays auto-calculated budget breakdown with formulas
 * Budget auto-calculated from city distance + activities + stay duration
 */
export default function CostBreakdownPanel({ trip, showChart = false }: CostBreakdownPanelProps) {
  const { getCostBreakdown } = useTrips();
  const costBreakdown = getCostBreakdown(trip);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Auto-Calculated Budget
          <HoverCard>
            <HoverCardTrigger>
              <Info size={16} className="text-blue-600 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2 text-sm">
                <p className="font-semibold">How costs are calculated:</p>
                <div className="space-y-2 text-gray-600">
                  <div>
                    <p className="font-medium text-teal-600">Transport:</p>
                    <p className="text-xs">
                      Bus (&lt;200km): ₹10/km<br />
                      Train (200-800km): ₹500 + ₹8/km<br />
                      Flight (&gt;800km): ₹2000 + ₹5/km
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600">Accommodation:</p>
                    <p className="text-xs">City cost index × ₹1000 × nights</p>
                  </div>
                  <div>
                    <p className="font-medium text-orange-600">Food:</p>
                    <p className="text-xs">City cost index × ₹500 × days</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-600">Activities:</p>
                    <p className="text-xs">Sum of all activity costs</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    💡 Budget updates automatically when you add/remove cities or change dates
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
            <div className="flex items-center gap-2">
              <Plane className="text-teal-600" size={20} />
              <div>
                <span className="block">Transport</span>
                <span className="text-xs text-gray-600">Distance-based</span>
              </div>
            </div>
            <span className="font-semibold">₹{costBreakdown.transport.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center gap-2">
              <Hotel className="text-blue-600" size={20} />
              <div>
                <span className="block">Accommodation</span>
                <span className="text-xs text-gray-600">Cost index × nights</span>
              </div>
            </div>
            <span className="font-semibold">₹{costBreakdown.accommodation.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <div className="flex items-center gap-2">
              <Utensils className="text-orange-600" size={20} />
              <div>
                <span className="block">Food</span>
                <span className="text-xs text-gray-600">Cost index × days</span>
              </div>
            </div>
            <span className="font-semibold">₹{costBreakdown.food.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center gap-2">
              <ActivityIcon className="text-purple-600" size={20} />
              <div>
                <span className="block">Activities</span>
                <span className="text-xs text-gray-600">Sum of all costs</span>
              </div>
            </div>
            <span className="font-semibold">₹{costBreakdown.activities.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Estimated Total</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{costBreakdown.total.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            ⚙️ Auto-recalculates when trip changes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
