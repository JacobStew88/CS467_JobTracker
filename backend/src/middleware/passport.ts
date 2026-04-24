import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { getUserById } from '../models/userModel';
import { JWTUserPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'DEVELOPMENT_FALL_BACK_KEY';

const option: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

passport.use(
    new JwtStrategy(option, async (payload: JWTUserPayload, done) => {
        try{
            const user = await getUserById(payload.user_id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

export const requireAuth = passport.authenticate('jwt', { session: false });

// Source: https://github.com/mikenicholson/passport-jwt w/ AI summary and clarifications