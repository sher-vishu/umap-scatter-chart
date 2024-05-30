module Api
     module V1
       class DataPointsController < ApplicationController
         def index
          data_points = DataPoint.all
          render json: data_points
         end
       end
     end
   end
   