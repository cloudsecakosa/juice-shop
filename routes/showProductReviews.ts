/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import utils = require('../lib/utils')
import challengeUtils = require('../lib/challengeUtils')
import { type Request, type Response, type NextFunction } from 'express'
import { type Review } from 'data/types'

const challenges = require('../data/datacache').challenges
const security = require('../lib/insecurity')
const db = require('../data/mongodb')

module.exports = function productReviews() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ensure ID is treated as a number if it comes from an environment where it's safe
    const id = utils.disableOnContainerEnv() ? Number(req.params.id) : req.params.id

    try {
      const t0 = new Date().getTime()
      const reviews: Review[] = await db.reviews.find({ product: id }).toArray()
      const t1 = new Date().getTime()

      // Check if query took too long, potentially indicating a NoSQL injection attempt
      challengeUtils.solveIf(challenges.noSqlCommandChallenge, () => (t1 - t0) > 2000)

      const user = security.authenticatedUsers.from(req)
      reviews.forEach(review => {
        if (user && review.likedBy.includes(user.data.email)) {
          review.liked = true
        }
      })

      res.json(utils.queryResultToJson(reviews))
    } catch (error) {
      res.status(400).json({ error: 'Wrong Params' })
    }
  }
}